import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { Request, Response } from 'express';
import * as cryptoJs from 'crypto-js';

import {
  DiscordOAuth2CredentialsResponse,
  DiscordOAuth2UserDataResponse,
} from './discord-auth.types';
import { DiscordAuth } from './discord-auth.entity';
import { DiscordAuthRepository } from './discord-auth.repository';
import { IDiscordAuthRepository } from './interfaces/discord-auth.repository.interface';
import { ProfileService } from '../profile/profile.service';
import config from '../../config';

let discordId: string;
let discordAccessToken: string;
let discordRefreshToken: string;

@Injectable()
export class DiscordAuthService {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    @Inject(DiscordAuthRepository)
    private readonly discordAuthRepository: IDiscordAuthRepository,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
  ) {}

  private async encryptToken(
    token: string,
  ): Promise<cryptoJs.lib.CipherParams> {
    return cryptoJs.AES.encrypt(token, this.configService.encryptSecret);
  }

  private async decryptToken(
    encryptedToken: cryptoJs.lib.CipherParams,
  ): Promise<cryptoJs.lib.WordArray> {
    return cryptoJs.AES.decrypt(
      encryptedToken,
      this.configService.encryptSecret,
    );
  }

  private async setCookie(
    name: string,
    res: Response,
    refreshToken: string,
  ): Promise<void> {
    res.cookie(name, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  private async removeCookie(res: Response): Promise<void> {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  async discordAuthRedirect(req: any, res: Response) {
    discordAccessToken = req.user.accessToken;
    discordRefreshToken = req.user.refreshToken;
    res.redirect(this.configService.frontendUrl);
  }

  async getDiscordToken() {
    try {
      const formData = new URLSearchParams({
        client_id: this.configService.discordClientId,
        client_secret: this.configService.discordClientSecret,
        grant_type: 'refresh_token',
        refresh_token: discordRefreshToken,
      });
      const { data: credentialsReponse } = await firstValueFrom(
        this.httpService.post<DiscordOAuth2CredentialsResponse>(
          'https://discord.com/api/oauth2/token',
          formData.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      const encryptedAccessToken = await this.encryptToken(
        credentialsReponse.access_token,
      );
      const decryptedAccessToken = await this.decryptToken(
        encryptedAccessToken,
      );
      const encryptedRefreshToken = await this.encryptToken(
        credentialsReponse.refresh_token,
      );
      const decryptedRefreshToken = await this.decryptToken(
        encryptedRefreshToken,
      );
      discordAccessToken = decryptedAccessToken.toString(cryptoJs.enc.Utf8);
      discordRefreshToken = decryptedRefreshToken.toString(cryptoJs.enc.Utf8);
      return { message: 'authentication with discord successful' };
    } catch (error) {
      throw new BadRequestException(error.response?.data || error.message);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { data: userResponse } = await firstValueFrom(
        this.httpService.get<DiscordOAuth2UserDataResponse>(
          'https://discord.com/api/users/@me',
          {
            headers: {
              Authorization: `Bearer ${discordAccessToken}`,
            },
          },
        ),
      );

      discordId = userResponse.id;

      const userFound = await this.discordAuthRepository.findByDiscordId(
        discordId,
      );
      if (!userFound) {
        const profile = await this.profileService.createProfile();
        const { id, profileId, role } = await this.createUser(
          userResponse,
          profile.id,
        );
        const payload = { sub: id, profileId: profileId, role: role };
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.jwtSecret,
          expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.jwtRefresh,
          expiresIn: '1d',
        });
        await this.setCookie('refresh_token', res, refreshToken);
        await this.saveRefreshToken(discordId, refreshToken, req);
        res.send({ accessToken });
        return { accessToken };
      } else {
        const payload = {
          sub: userFound.id,
          profileId: userFound.profileId,
          role: userFound.role,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.jwtSecret,
          expiresIn: '15m',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.jwtRefresh,
          expiresIn: '1d',
        });
        await this.setCookie('refresh_token', res, refreshToken);
        await this.updateUser(userResponse);
        await this.saveRefreshToken(discordId, refreshToken, req);
        res.send({ accessToken });
        return { accessToken };
      }
    } catch (error) {
      throw new BadRequestException(error.response?.data || error.message);
    }
  }

  async revokeAuth(req: Request, res: Response) {
    const formData = new URLSearchParams({
      client_id: this.configService.discordClientId,
      client_secret: this.configService.discordClientSecret,
      token: discordAccessToken,
    });
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://discord.com/api/oauth2/token/revoke',
          formData.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      await this.removeCookie(res);
      await this.removeRefreshToken(discordId, req);
      res.send(response.data);
    } catch (error) {
      throw new BadRequestException(error.response?.data || error.message);
    }
  }

  async createUser(
    userResponse: DiscordOAuth2UserDataResponse,
    profileId: number,
  ): Promise<DiscordAuth> {
    const newUser = new DiscordAuth();
    newUser.profileId = profileId;
    newUser.discordId = userResponse.id;
    newUser.username = userResponse.username;
    newUser.email = userResponse.email;
    newUser.avatar = userResponse.avatar;
    newUser.discriminator = userResponse.discriminator;
    return await this.discordAuthRepository.save(newUser);
  }

  async updateUser(userResponse: DiscordOAuth2UserDataResponse) {
    const userFound = await this.discordAuthRepository.findByDiscordId(
      userResponse.id,
    );
    if (userFound) {
      const discordAuth = new DiscordAuth();
      discordAuth.id = userFound.id;
      discordAuth.username = userResponse.username;
      discordAuth.avatar = userResponse.avatar;
      await this.discordAuthRepository.update(discordAuth);
    }
  }

  async saveRefreshToken(
    discordId: string,
    refreshToken: string,
    req: Request,
  ) {
    const jwtCookie = req.cookies.refresh_token;
    const userFound = await this.discordAuthRepository.findByDiscordId(
      discordId,
    );
    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== jwtCookie,
    );
    userFound.refreshToken = [...newRefreshTokenArray, refreshToken];
    const user = new DiscordAuth();
    user.id = userFound.id;
    user.refreshToken = userFound.refreshToken;
    await this.discordAuthRepository.saveRefreshToken(user);
  }

  async removeRefreshToken(discordId: string, req: Request) {
    const jwtCookie = req.cookies.refresh_token;
    const userFound = await this.discordAuthRepository.findByDiscordId(
      discordId,
    );
    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== jwtCookie,
    );
    userFound.refreshToken = [...newRefreshTokenArray];
    const user = new DiscordAuth();
    user.id = userFound.id;
    user.refreshToken = userFound.refreshToken;
    await this.discordAuthRepository.removeRefreshToken(user);
  }
}

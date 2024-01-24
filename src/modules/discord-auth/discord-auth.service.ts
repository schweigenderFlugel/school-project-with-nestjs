import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigType } from "@nestjs/config";
import { NotFoundError, firstValueFrom } from "rxjs";
import { Response } from "express";

import { DiscordOAuth2CredentialsResponse, DiscordOAuth2UserDataResponse } from "./discord-auth.types";
import { DiscordAuth } from "./discord-auth.entity";
import { DiscordAuthRepository } from "./discord-auth.repository";
import { IDiscordAuthRepository } from "./interfaces/discord-auth.repository.interface";
import { UsersService } from "../users/users.service";
import config from "../../config";

let accessToken: string;
let refreshToken: string;

@Injectable()
export class DiscordAuthService {
  constructor(
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
    @Inject(DiscordAuthRepository) private readonly discordAuthRepository: IDiscordAuthRepository,
    private readonly httpService: HttpService,
  ) {}

  async discordAuthRedirect(req: any) {
    accessToken = req.user.accessToken;
    refreshToken = req.user.refreshToken;
    return { message: 'authentication with discord successful!' };
  }

  async getDiscordToken() {
    try {
      const formData = new URLSearchParams({
        client_id: this.configService.discordClientId,
        client_secret: this.configService.discordClientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      const { data: credentialsReponse } = await firstValueFrom(
        this.httpService.post<DiscordOAuth2CredentialsResponse>(
          'https://discord.com/api/oauth2/token', 
          formData.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
      );

      accessToken = credentialsReponse.access_token;
      refreshToken = credentialsReponse.refresh_token;
      return { accessToken: accessToken, refreshToken: refreshToken };
    } catch (error) {  
      throw new BadRequestException(error.response?.data || error.message)
    }
  }

  async getUser() {
    try {
      const { data: userResponse } = await firstValueFrom(
        this.httpService.get<DiscordOAuth2UserDataResponse>('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      )

      const userFound = await this.discordAuthRepository.findByDiscordId(userResponse.id);
      if (!userFound) {
        return {
          message: 'reading directly from the discord authentication data' ,
          id: userResponse.id,
          username: userResponse.username,
          email: userResponse.email,
          avatar: userResponse.avatar,
          discriminator: userResponse.discriminator
        }
      }
      return userFound;
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(error.message);
      else throw new BadRequestException(error.response?.data || error.message)
    }
  }

  async createUser() {
    try {
      const { data: userResponse } = await firstValueFrom(
        this.httpService.get<DiscordOAuth2UserDataResponse>('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      )
  
      const newUser = new DiscordAuth(
        userResponse.id,
        userResponse.username,
        userResponse.email,
        userResponse.avatar,
        userResponse.discriminator,
        refreshToken,
      )
      await this.discordAuthRepository.save(newUser)
      return { message: 'user created with discord successfully!'}
    } catch (error) {
      throw new BadRequestException(error.response?.data || error.message)
    }
  }

  async revokeAuth(res: Response) {
    const formData = new URLSearchParams({
      client_id: this.configService.discordClientId,
      client_secret: this.configService.discordClientSecret,
      token: accessToken
    })
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://discord.com/api/oauth2/token/revoke',
          formData.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        )
      )
      res.send(response.data)
    } catch (error) {
      throw new BadRequestException(error.response?.data || error.message)
    }
  }
}

import { Injectable, Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigType } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { Request, Response } from "express";

import config from "../../config";

@Injectable()
export class DiscordAuthService {
  constructor(
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
    private readonly httpService: HttpService,
  ) {}

  private async setCookie(name: string, res: Response, refreshToken: string) {
    res.cookie(name, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 24 * 60* 60 * 1000),
    })
  }

  async setDiscordRefreshTokenCookie(req: any, res: Response) {
    await this.setCookie('discord_refresh_token', res, req.user.refreshToken);
    res.redirect('/discord/user')
  }

  async getDiscordAuthData(req: Request) {
    const discordRefreshToken = req.cookies.discord_refresh_token;
    if (!discordRefreshToken) throw new NotFoundException('cookie not found!')
    try {
      const formData = new URLSearchParams({
        client_id: this.configService.discordClientId,
        client_secret: this.configService.discordClientSecret,
        grant_type: 'refresh_token',
        refresh_token: discordRefreshToken,
      })
      const response = await firstValueFrom(
        this.httpService.post('https://discord.com/api/oauth2/token', formData.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
      const accessToken = response.data.access_token;
      const userResponse = await firstValueFrom(this.httpService.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }))
      return userResponse.data;
    } catch (error) {
      console.log('Error al obtener access token', error.response?.data || error.message);
      throw new BadRequestException('Error al obtener access token')
    }
  }
}

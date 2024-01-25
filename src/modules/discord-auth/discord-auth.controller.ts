import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { DiscordAuthService } from './discord-auth.service';

@ApiTags('Discord')
@Controller()
export class DiscordAuthController {
  constructor(private readonly authDiscordService: DiscordAuthService) {}

  @ApiOperation({ summary: 'authetication with discord' })
  @UseGuards(AuthGuard('discord'))
  @Get('discord/auth')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async authWithDiscord() {}

  @UseGuards(AuthGuard('discord'))
  @Get('discord/redirect')
  async redirectWithDiscord(@Req() req: Request, @Res() res: Response) {
    return await this.authDiscordService.discordAuthRedirect(req, res);
  }

  @ApiOperation({ summary: 'get access and refresh token from discord' })
  @Get('discord/token')
  async getAuthData() {
    return await this.authDiscordService.getDiscordToken();
  }

  @ApiOperation({ summary: 'get user data by the discord id'})
  @Get('discord/user')
  async getUser() {
    return await this.authDiscordService.getUser()
  }

  @ApiOperation({ summary: 'create a new user from the discord user data'})
  @Get('discord/create')
  async createUser() {
    return await this.authDiscordService.createUser()
  }

  @ApiOperation({ summary: 'revoke the access token'})
  @Get('discord/revoke')
  async revokeAuth(@Res() res: Response) {
    return await this.authDiscordService.revokeAuth(res)
  }
}

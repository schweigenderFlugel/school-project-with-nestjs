import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { Strategy } from 'passport-discord';
import config from 'src/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    @Inject(config.KEY) readonly configService: ConfigType<typeof config>,
  ) {
    super({
      clientID: configService.discordClientId,
      clientSecret: configService.discordClientSecret,
      callbackURL: '/discord/redirect',
      scope: ['identify'],
    });
  }

  validate(accessToken: any, refreshToken: any, profile: any, done: any) {
    const user = {
      id: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      discriminator: profile.discriminator,
      accessToken,
      refreshToken,
    };
    return done(null, user);
  }
}

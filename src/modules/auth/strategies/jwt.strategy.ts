import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import config from '../../../config';
import { Payload } from 'src/common/interfaces/user-request.interface';
import { ENVIRONMENTS } from 'src/environments';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) readonly configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.nodeEnv === ENVIRONMENTS.PRODUCTION
        ? configService.jwtSecret
        : 'secret',
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return {
      id: payload.id,
      role: payload.role,
      profile: payload.profile,
    };
  }
}

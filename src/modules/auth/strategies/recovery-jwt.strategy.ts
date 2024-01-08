import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../../../config';

@Injectable()
export class RecoveryJwtStrategy extends PassportStrategy(Strategy, 'recovery-jwt') {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      extractFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtRecovery,
    })
  }

  async validate(payload: any) {
    return payload;
  }
  
}
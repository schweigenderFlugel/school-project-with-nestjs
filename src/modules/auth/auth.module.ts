import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../../modules/users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { NodemailerModule } from '../nodemailer/nodemailer.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';


@Module({ 
  imports: [
    UsersModule,
    ProfileModule,
    NodemailerModule,
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy]
})

export class AuthModule {}
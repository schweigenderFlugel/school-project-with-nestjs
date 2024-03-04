import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { ProfileService } from '../profile/profile.service';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { ActivationCodeDto, SignUpDto } from './auth.dto';
import config from '../../config';
import { Payload, JwtTokens, UserRequest } from '../../common/interfaces/user-request.interface';
import { ENVIRONMENTS } from '../../environments';

@Injectable()
export class AuthService {
  COOKIE_NAME: string;
  JWT_SECRET: string;
  JWT_REFRESH: string;
  JWT_RECOVERY: string;
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
    private readonly nodemailerService: NodemailerService,
  ) {
    this.COOKIE_NAME = this.configService.nodeEnv === ENVIRONMENTS.PRODUCTION
      ? this.configService.httpOnlyCookieName
      : 'cookie';
    this.JWT_SECRET = this.configService.nodeEnv === ENVIRONMENTS.PRODUCTION
      ? this.configService.jwtSecret
      : 'secret';
    this.JWT_REFRESH = this.configService.nodeEnv === ENVIRONMENTS.PRODUCTION
      ? this.configService.jwtRefresh
      : 'refresh_secret';
    this.JWT_RECOVERY = this.configService.nodeEnv === ENVIRONMENTS.PRODUCTION
      ? this.configService.jwtRecovery
      : 'recovery_secret'
  }

  private async getTokens(payload: Payload): Promise<JwtTokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.JWT_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: this.JWT_REFRESH,
    });
    return { accessToken, refreshToken };
  }

  private async setCookie(res: Response, refreshToken: string): Promise<void> {
    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
    res.cookie(this.COOKIE_NAME, refreshToken, options);
  }

  private async removeCookie(res: Response): Promise<void> {
    const options: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    }
    res.clearCookie(this.COOKIE_NAME, options);
  }

  private async generateCode(): Promise<string> {
    const length = 16;
    let base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '123456789';
    base += numbers;
    let code: string = "";
    for (let x = 0; x < length; x++ ) {
      const random1 = Math.floor(Math.random() * base.length);
      code += base.charAt(random1);
    }
    return code;
  }

  async signUp(data: SignUpDto): Promise<{ message: string }> {
    try {
      if (data.password === data.confirmPassword) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const activationCode = await this.generateCode();
        const { id: profile } = await this.profileService.createProfile();
        await this.usersService.createUser({ ...data, profile, activationCode });
        await this.nodemailerService.forSigningUp(data.email, activationCode);
        return { message: "new user created" }
      } else {
        throw new BadRequestException('the passwords should be equal');
      }
    } catch (error) {
      if (error instanceof ConflictException)
        throw new ConflictException(error.message);
      else if (error instanceof BadRequestException)
        throw new BadRequestException(error.message);
    }
  }

  async activateRegister(data: ActivationCodeDto) {
    try {
      await this.usersService.activateRegister(data.code);
      return { message: "activation successful!"}
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async validateUser(email: string, password: string): Promise<object | null> {
    try {
      const userFound = await this.usersService.getUserByEmail(email);
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (isMatch) {
        if (userFound.isActive !== true) throw new ForbiddenException('not allowed to login!');
        return userFound;
      }
      return null;
    } catch (error) {
      if (error instanceof ForbiddenException)
        throw new ForbiddenException(error.message);
    }
  }

  async generateJwt(req: UserRequest, res: Response): Promise<{ accessToken: string }> {
    try {
      const jwtCookie = req.cookies[this.COOKIE_NAME];
      if (!jwtCookie) {
        const payload: Payload = { id: req.user.id, role: req.user.role, profile: req.user.profile };
        const { accessToken, refreshToken } = await this.getTokens(payload);
        await this.setCookie(res, refreshToken);
        await this.usersService.saveRefreshToken(
          req.user.id,
          jwtCookie,
          refreshToken,
        );
        return { accessToken };
      } else {
        const verify = await this.jwtService.verifyAsync(jwtCookie, {
          secret: this.JWT_REFRESH,
        });
        if (verify) throw new ConflictException(`you've already logged in`);
      }
    } catch (error) {
      const jwtCookie = req.cookies[this.COOKIE_NAME];
      const decoded = await this.jwtService.decode(jwtCookie);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else if (error instanceof TokenExpiredError) {
        await this.usersService.removeRefreshToken(decoded.id, jwtCookie);
        throw new ForbiddenException(error.message);
      } else if (error instanceof JsonWebTokenError) {
        await this.usersService.removeRefreshToken(decoded.id, jwtCookie);
        throw new ForbiddenException(error.message);
      }
    }
  }

  async getNewToken(req: Request, res: Response): Promise<{ accessToken: string }> {
    try {
      const jwtCookie = req.cookies[this.COOKIE_NAME];
      if (!jwtCookie) throw new NotFoundException('cookie not found!');
      await this.jwtService.verifyAsync(jwtCookie, {
        secret: this.JWT_REFRESH,
      });
      const decoded = await this.jwtService.decode<Promise<Payload>>(jwtCookie);
      const payload: Payload = { id: decoded.id, role: decoded.role, profile: decoded.profile };
      const { accessToken, refreshToken } = await this.getTokens(payload);
      await this.removeCookie(res);
      await this.setCookie(res, refreshToken);
      await this.usersService.saveRefreshToken(
        decoded.id,
        jwtCookie,
        refreshToken,
      );
      return { accessToken };
    } catch (error) {
      const jwtCookie = req.cookies.refresh_token;
      const decoded = await this.jwtService.decode<Promise<Payload>>(jwtCookie);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof TokenExpiredError) {
        await this.usersService.removeRefreshToken(decoded.id, jwtCookie);
        await this.removeCookie(res);
        throw new ForbiddenException(error.message);
      } else if (error instanceof JsonWebTokenError) {
        await this.usersService.removeRefreshToken(decoded.id, jwtCookie);
        await this.removeCookie(res);
        throw new ForbiddenException(error.message);
      }
    }
  }

  async generateRecoveryToken(user: any): Promise<void> {
    const userFound = await this.usersService.getUserByEmail(user.email);
    const payload = { sub: userFound.id };
    const recoveryToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.JWT_RECOVERY,
    });
    const link = `http://localhost:3000/update-password/${recoveryToken}`;
    const recoveryCode = await this.generateCode();
    await this.nodemailerService.forRecoveringPassword(link, recoveryCode, userFound.email);
  }

  async updatePassword(token: string, password: string): Promise<string> {
    const verified = await this.jwtService.verifyAsync(token, {
      secret: this.JWT_RECOVERY,
    });
    if (!verified) {
      throw new UnauthorizedException('not allowed');
    }
    return password;
  }

  async signOut(req: UserRequest, res: Response): Promise<object> {
    const jwtCookie = req.cookies[this.COOKIE_NAME];
    try {
      if (!jwtCookie) throw new NotFoundException('cookie not found!');
      await this.jwtService.verify(jwtCookie, {
        secret: this.JWT_REFRESH,
      });
      const decoded = await this.jwtService.decode<Promise<Payload>>(jwtCookie);
      const userId = decoded.id;
      await this.removeCookie(res);
      await this.usersService.removeRefreshToken(userId, jwtCookie);
      return { message: 'logged out successfully' };
    } catch (error) {
      const decoded = await this.jwtService.decode<Promise<Payload>>(jwtCookie);
      const userId = decoded?.id;
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof TokenExpiredError) {
        await this.usersService.removeRefreshToken(userId, jwtCookie);
        await this.removeCookie(res);
        throw new ForbiddenException(error.message);
      } else if (error instanceof JsonWebTokenError) {
        await this.usersService.removeRefreshToken(userId, jwtCookie);
        await this.removeCookie(res);
        throw new ForbiddenException(error.message);
      }
    }
  }
}

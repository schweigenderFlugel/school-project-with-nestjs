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
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { SignUpDto } from './auth.dto';
import config from '../../config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  private async setCookie(
    name: string,
    res: Response,
    refreshToken: string,
  ): Promise<void> {
    res.cookie(name, refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  private async removeCookie(res: Response): Promise<void> {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });
  }

  async signUp(data: SignUpDto): Promise<object> {
    try {
      if (data.password === data.confirmPassword) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        await this.usersService.createUser(data);
        // await this.nodemailerService.sendMail(data.email);
        return { message: 'new user created' };
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

  async validateUser(email: string, password: string): Promise<object> {
    try {
      const userFound = await this.usersService.getUserByEmail(email);
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (userFound.isActive !== true)
        throw new ForbiddenException('not allowed to login');
      if (isMatch) return userFound;
      else return null;
    } catch (error) {
      if (error instanceof ForbiddenException)
        throw new ForbiddenException(error.message);
    }
  }

  async generateJwt(user: any, req: Request, res: Response): Promise<object> {
    try {
      const jwtCookie = req.cookies.refresh_token;
      if (!jwtCookie) {
        const payload = { sub: user.id, profileId: user.profileId, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, {
          expiresIn: '10m',
          secret: this.configService.jwtSecret,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
          expiresIn: '1d',
          secret: this.configService.jwtRefresh,
        });
        await this.setCookie('refresh_token', res, refreshToken);
        await this.usersService.saveRefreshToken(
          user.id,
          jwtCookie,
          refreshToken,
        );
        return { accessToken };
      } else {
        const verify = await this.jwtService.verifyAsync(jwtCookie, {
          secret: this.configService.jwtRefresh,
        });
        if (verify) throw new ConflictException(`you've already logged in`);
      }
    } catch (error) {
      const jwtCookie = req.cookies.refresh_token;
      const decoded = await this.jwtService.decode(jwtCookie);
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else if (error instanceof TokenExpiredError) {
        await this.usersService.removeRefreshToken(decoded.sub, jwtCookie);
        throw new ForbiddenException(error.message);
      } else if (error instanceof JsonWebTokenError) {
        await this.usersService.removeRefreshToken(decoded.sub, jwtCookie);
        throw new ForbiddenException(error.message);
      }
    }
  }

  async getNewToken(req: Request, res: Response): Promise<object> {
    try {
      const jwtCookie = req.cookies.refresh_token;
      if (!jwtCookie) throw new NotFoundException('cookie not found!');
      await this.jwtService.verifyAsync(jwtCookie, {
        secret: this.configService.jwtRefresh,
      });
      const decoded = await this.jwtService.decode(jwtCookie);
      const payload = { sub: decoded.sub, role: decoded.role };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m',
        secret: this.configService.jwtSecret,
      });
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: this.configService.jwtRefresh,
      });
      await this.removeCookie(res);
      await this.setCookie('refresh_token', res, newRefreshToken);
      await this.usersService.saveRefreshToken(
        decoded.sub,
        jwtCookie,
        newRefreshToken,
      );
      return { accessToken };
    } catch (error) {
      const jwtCookie = req.cookies.refresh_token;
      const decoded = await this.jwtService.decode(jwtCookie);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof TokenExpiredError) {
        await this.usersService.removeRefreshToken(decoded.sub, jwtCookie);
        await this.removeCookie(res);
        throw new ForbiddenException(error.message);
      } else if (error instanceof JsonWebTokenError) {
        await this.usersService.removeRefreshToken(decoded.sub, jwtCookie);
        await this.removeCookie(res);
        throw new ForbiddenException(error.message);
      }
    }
  }

  async generateRecoveryToken(user: any): Promise<object> {
    const userFound = await this.usersService.getUserByEmail(user.email);
    const payload = { sub: userFound.id };
    const recoveryToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.jwtRecovery,
    });
    return {
      link: `http://localhost:3000/update-password/${recoveryToken}`,
    };
  }

  async updatePassword(token: string, password: string): Promise<string> {
    const verified = await this.jwtService.verifyAsync(token, {
      secret: this.configService.jwtRecovery,
    });
    if (!verified) {
      throw new UnauthorizedException('not allowed');
    }
    return password;
  }

  async signOut(jwtCookie: string, res: Response): Promise<object> {
    try {
      if (!jwtCookie) throw new NotFoundException('cookie not found!');
      await this.jwtService.verify(jwtCookie, {
        secret: this.configService.jwtRefresh,
      });
      const decoded = await this.jwtService.decode(jwtCookie);
      const userId = decoded.sub;
      await this.removeCookie(res);
      await this.usersService.removeRefreshToken(userId, jwtCookie);
      return { message: 'logged out successfully' };
    } catch (error) {
      const decoded = await this.jwtService.decode(jwtCookie);
      const userId = decoded?.sub;
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

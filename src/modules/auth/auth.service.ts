import { 
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException } from '@nestjs/common';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './auth.dto';
import config from '../../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
  ) {}

  private async setCookie(res: Response, refreshToken: string): Promise<void> {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: new Date(Date.now() + 24 * 60* 60 * 1000),
    })
  }

  private async removeCookie(res: Response): Promise<void> {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'none' 
    })
  }

  async signUp(data: SignUpDto): Promise<object> {
    if (data.password === data.confirmPassword) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      return await this.usersService.createUser(data);
    } else {
      throw new BadRequestException('the passwords should be equal')
    }
  }

  async validateUser(email: string, password: string): Promise<object> {
    const userFound = await this.usersService.getUserByEmail(email);
    const isMatch = await bcrypt.compare(password, userFound.password)
    if (isMatch) {
      return userFound;
    }
    return null;
  }

  async generateJwt(user: any, req: Request, res: Response): Promise<object> {
    try {
      const jwtCookie = req.cookies.refresh_token;
      if (!jwtCookie) {
        const payload = { sub: user.id, role: user.role};
        const accessToken = await this.jwtService.signAsync(payload, { 
          expiresIn: '10m',
          secret: this.configService.jwtSecret 
        })
        const refreshToken = await this.jwtService.signAsync(payload, { 
          expiresIn: '1d', 
          secret: this.configService.jwtRefresh
        })
        await this.setCookie(res, refreshToken)
        await this.usersService.saveRefreshToken(user.id, refreshToken);
        return { accessToken };
      } else {
        const verify = await this.jwtService.verify(jwtCookie, { secret: this.configService.jwtRefresh })
        if (verify) throw new ConflictException(`you've already logged in`)
      }
    } catch (error) {
      if (error instanceof ConflictException) { 
        throw new ConflictException( error.message )
      } else if (error instanceof TokenExpiredError) {
        await this.signOut(req.cookies.refresh_token, res);
        throw new ForbiddenException( error.message );
      } else if (error instanceof JsonWebTokenError) {
        await this.signOut(req.cookies.refresh_token, res);
        throw new ForbiddenException( error.message );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async getNewToken(req: Request, res: Response): Promise<object> {
    try {
      const jwtCookie = req.cookies.refresh_token;
      const decoded = await this.jwtService.decode(jwtCookie);
      const payload = { sub: decoded.sub, role: decoded.role }; 
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10m', 
        secret: this.configService.jwtSecret
      })
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1d', 
        secret: this.configService.jwtRefresh 
      })
      await this.removeCookie(res);
      await this.setCookie(res, refreshToken);
      await this.usersService.saveRefreshToken(decoded.sub, refreshToken);
      return { accessToken }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        console.error(error)
      }
    }
  }

  async generateRecoveryToken(user: any): Promise<object> {
    const userFound = await this.usersService.getUserByEmail(user.email);
    const payload = { sub: userFound.id }
    const recoveryToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.jwtRecovery,
    })
    return {
      link: `http://localhost:3000/update-password/${recoveryToken}`,
    }
  }

  async updatePassword(token: string, password: string): Promise<string> {
    const verified = await this.jwtService.verifyAsync(token, {
      secret: this.configService.jwtRecovery 
    });
    if (!verified) {
      throw new UnauthorizedException('not allowed')
    }
    return password;
  }

  async signOut(refreshToken: string, res: Response): Promise<object> {
    const decoded = await this.jwtService.decode(refreshToken);
    const userId = decoded.sub;
    await this.removeCookie(res)
    await this.usersService.removeRefreshToken(userId, refreshToken);
    return { message: 'logged out successfully'}
  }
}
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { ActivationCodeDto, SignInDto, SignUpDto } from './auth.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'to create a new user' })
  @Post('sign-up')
  async signUp(@Body() data: SignUpDto) {
    return await this.authService.signUp(data);
  }

  @ApiOperation({
    summary: 'to login and to get an access and a refresh token cookie',
  })
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signIn(
    @Body() data: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.generateJwt(req.user, req, res);
  }

  @ApiOperation({ summary: 'to introduce the code and activate register' })
  @Put('activation/:id')
  async activateRegister(
    @Body() data: ActivationCodeDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return await this.authService.activateRegister(id, data);
  }

  @ApiOperation({ summary: 'to get a new access and a refresh token cookie' })
  // @UseGuards(AuthGuard('refresh-jwt'))
  @Get('new-token')
  async getNewToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.getNewToken(req, res);
  }

  @Post('password-recovery')
  async recoveryPassword(@Body() email: string) {
    return await this.authService.generateRecoveryToken(email);
  }

  @Put('update-password/:token')
  async updatePassword(
    @Param('token') token: string,
    @Body() password: string,
  ) {
    return await this.authService.updatePassword(token, password);
  }

  @ApiOperation({ summary: 'to logout and remove the refresh token cookie' })
  // @UseGuards(AuthGuard('refresh-jwt'))
  @Get('sign-out')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signOut(req.cookies.refresh_token, res);
  }
}

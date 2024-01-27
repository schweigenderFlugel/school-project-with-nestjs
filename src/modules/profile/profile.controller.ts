import {
  Controller,
  Get,
  Put,
  Req,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Express } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './profile.dto';
import { uploadFileConfig } from '../../file-upload.config';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: Request) {
    return await this.profileService.getProfile(req.user);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor(
      'image',
      uploadFileConfig('profile', ['image/jpeg', 'image/png']),
    ),
  )
  async updateProfile(
    @Req() req: Request,
    @Body() changes: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.profileService.updateProfile(req.user, changes, image);
  }
}

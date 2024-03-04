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
import { UserRequest } from 'src/common/interfaces/user-request.interface';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: UserRequest) {
    return await this.profileService.getProfile(req);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor(
      'image',
      uploadFileConfig('profile', ['image/jpeg', 'image/png']),
    ),
  )
  async updateProfile(
    @Req() req: UserRequest,
    @Body() changes: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.profileService.updateProfile(req, changes, image);
  }
}

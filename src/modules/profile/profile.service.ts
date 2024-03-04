import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as fs from 'node:fs';

import { ENVIRONMENTS } from '../../environments';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './profile.dto';
import { ProfileRepository } from './profile.repository';
import { IProfileRepository } from './interfaces/profile.repository.interface';
import { Profile } from './profile.entity';
import { UserRequest } from 'src/common/interfaces/user-request.interface';
import config from '../../config';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: IProfileRepository,
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private profiles = [
    {
      id: '1',
      fullName: 'Juan De Tales',
      address: 'Av Maza',
      phone: 2610000000,
      description: '',
      userId: '383bfd34-d368-4981-90dc-8481e45e91da',
      imageUrl: '',
    },
    {
      id: '2',
      fullName: 'John Doe',
      address: 'Calle Avellaneda',
      phone: 2610000001,
      description: '',
      userId: '54f47a6a-5b36-4738-99d4-b34723c9e2dc',
      imageUrl: '',
    },
  ];

  async getProfile(req: UserRequest): Promise<Profile> {
    const profileFound = await this.profileRepository.findById(req.user.profile);
    if (!profileFound) throw new NotFoundException('profile not found!');
    if(profileFound) {
      if (!profileFound.username && 
          !profileFound.fullName && 
          !profileFound.address && 
          !profileFound.description && 
          !profileFound.phone &&
          !profileFound.imageUrl) 
      {
        return null;
      }
    }
    return profileFound;
  }

  async createProfile(): Promise<Profile> {
    try {
      return await this.profileRepository.create();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProfile(
    req: UserRequest,
    changes: UpdateProfileDto,
    image: Express.Multer.File,
  ) {
    const profileFound = await this.profileRepository.findById(req.user.profile);
    if (!profileFound) throw new NotFoundException('profile not found');

    if (this.configService.nodeEnv === ENVIRONMENTS.PRODUCTION) {
      const result = await this.cloudinaryService.uploadFile(image, 'profile');
      profileFound.imageUrl = result.secure_url;
      const updatedProfile = await this.profileRepository.update(profileFound);
      return updatedProfile;
    } else if (this.configService.nodeEnv === ENVIRONMENTS.DEVELOPMENT) {
      fs.unlink(`${profileFound.imageUrl}`, (err) => {
        if (err) {
          profileFound.imageUrl = image?.path;
          const updatedProfile = this.profileRepository.update(profileFound);
          return updatedProfile;
        }
      });
      profileFound.imageUrl = image?.path;
      const updatedProfile = Object.assign(profileFound, changes);
      return updatedProfile;
    }
  }
}

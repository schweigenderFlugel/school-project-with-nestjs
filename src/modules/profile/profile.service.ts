import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

import { ENVIRONMENTS } from '../../environments';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './profile.dto';
import { ProfileRepository } from './profile.repository';
import { IProfileRepository } from './interfaces/profile.repository.interface';
import { Profile } from './profile.entity';

dotenv.config();

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: IProfileRepository,
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

  async getProfile(user: any) {
    const profileFound = await this.profileRepository.findByUserId(user.id);
    if (!profileFound) throw new NotFoundException('profile not found');
    return profileFound;
  }

  async createProfile(userId: any): Promise<Profile> {
    const newProfile = new Profile(userId);
    return await this.profileRepository.create(newProfile);
  }

  async updateProfile(
    user: any,
    changes: UpdateProfileDto,
    image: Express.Multer.File,
  ) {
    const profileFound = await this.profileRepository.findByUserId(user.id);
    if (!profileFound) throw new NotFoundException('profile not found');

    if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
      const result = await this.cloudinaryService.uploadFile(image, 'profile');
      profileFound.imageUrl = result.secure_url;
      const updatedProfile = await this.profileRepository.update(profileFound);
      return updatedProfile;
    } else if (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
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

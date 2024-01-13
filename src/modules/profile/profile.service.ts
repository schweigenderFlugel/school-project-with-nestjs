import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as fs from 'fs'
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './profile.dto';
import { ENVIRONMENTS } from 'src/environments';
import * as dotenv from 'dotenv';
import { ProfileRepository } from './profile.repository';
import { IProfileRepository } from './interfaces/profile.repository.interface';
import { UsersService } from '../users/users.service';

dotenv.config()

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProfileRepository) private readonly profileRepository: IProfileRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}

  private profiles = [
    {
      id: '1',
      username: '',
      address: 'Av Maza',
      phone: 2610000000,
      description: '',
      userId: '383bfd34-d368-4981-90dc-8481e45e91da',
      imageUrl: ''
    },
    {
      id: '2',
      username: '',
      address: 'Calle Avellaneda',
      phone: 2610000001,
      description: '',
      userId: '54f47a6a-5b36-4738-99d4-b34723c9e2dc',
      imageUrl: ''
    }
  ]
    
  async getProfile(user: any) {
    const profileFound = this.profiles.find((profile) => profile.userId === user.id);
    if (!profileFound) {
      throw new NotFoundException('profile not found');
    }
    return profileFound;
  }

  async createProfile(user: any, data: any, image: Express.Multer.File) {
    const userFound = await this.usersService.getUserById(user.id)
    if (!userFound) throw new NotFoundException('user not found')

    if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
      const result = await this.cloudinaryService.uploadFile(image, 'profile');
      data.imageUrl = result.secure_url;
      await this.profileRepository.save(user.id, data)
      return data;
    } else if (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
      data.imageUrl = image?.path;
      await this.profileRepository.save(userFound.id, data)
      return data;
    }
  }

  async updateProfile(user: any, changes: UpdateProfileDto, image: Express.Multer.File) {
    const profileFound = this.profiles.find((profile) => profile.userId === user.id);
    if (!profileFound) throw new NotFoundException('profile not found');
    
    if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
      const result = await this.cloudinaryService.uploadFile(image, 'profile');
      profileFound.imageUrl = result.secure_url;
      const updatedProfile = Object.assign(profileFound, changes);
      return updatedProfile;
    } else if (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
      fs.unlink(`${profileFound.imageUrl}`, (err) => {
        if (err) {
          profileFound.imageUrl = image?.path;
          Object.assign(profileFound, changes);
        }
      })
      profileFound.imageUrl = image?.path;
      const updatedProfile = Object.assign(profileFound, changes);
      return updatedProfile;
    }
  }
}
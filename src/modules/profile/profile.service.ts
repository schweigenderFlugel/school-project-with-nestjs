import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs'
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './profile.dto';
import { ENVIRONMENTS } from 'src/environments';
import * as dotenv from 'dotenv';

dotenv.config()

@Injectable()
export class ProfileService {
  constructor(private cloudinaryService: CloudinaryService) {}
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

  async createProfile(profileId: string, userId: string, username: string) {
    const newProfile = {
      id: profileId,
      username: username,
      address: null,
      phone: null,
      description: null,
      userId,
      imageUrl: null,
    }
    this.profiles.push(newProfile)
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
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs'
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(private cloudinaryService: CloudinaryService) {}
  private profiles = [
    {
      id: '1',
      username: 'facundo497',
      address: 'Av Maza',
      phone: 2610000000,
      userId: '383bfd34-d368-4981-90dc-8481e45e91da',
      imageUrl: ''
    },
    {
      id: '2',
      username: 'fabito',
      address: 'Calle Avellaneda',
      phone: 2610000001,
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

  async createProfile(profileId: string, userId: string) {
    const newProfile = {
      id: profileId,
      username: null,
      address: null,
      phone: null,
      userId,
      imageUrl: null,
    }
    this.profiles.push(newProfile)
  }

  async updateProfile(user: any, changes: UpdateProfileDto, image: Express.Multer.File) {
    const profileFound = this.profiles.find((profile) => profile.userId === user.id);
    if (!profileFound) throw new NotFoundException('profile not found');
    fs.unlink(`${profileFound.imageUrl}`, (err) => {
      if (err) {
        profileFound.imageUrl = image?.path;
        Object.assign(profileFound, changes);
      }

    })
    profileFound.imageUrl = image?.path;
    // const updatedProfile = Object.assign(profileFound, changes);
    const result = await this.cloudinaryService.uploadFile(image, 'profile2');
    const imageUrl = {
      public_id: result.public_id,
      secure_url: result.secure_url
    }
    return imageUrl;

    // return updatedProfile;
  }
}
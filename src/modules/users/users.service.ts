import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Role } from '../../common/models/roles.model'; 
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UsersService {
  constructor(private profileService: ProfileService) {}

  private users = [
    {
      id: '383bfd34-d368-4981-90dc-8481e45e91da',
      email: 'admin@email.com',
      password: '$2b$10$JclD5ZmslCCbQApatOy3fOA3/GWnkgRb6T4EYMLxn44z8vtxEuQIu',
      refreshToken: [],
      recoveryToken: [],
      role: Role.ADMIN,
      profileId: '1',
      createdAt: "2023-12-21T20:08:43.084Z",
      updatedAt: "2023-12-21T20:08:43.084Z",
    },
    {
      id: "54f47a6a-5b36-4738-99d4-b34723c9e2dc",
      email: 'normal@email.com',
      password: '$2b$10$JclD5ZmslCCbQApatOy3fOA3/GWnkgRb6T4EYMLxn44z8vtxEuQIu',
      refreshToken: [],
      recoveryToken: [],
      role: Role.NORMAL,
      profileId: '2',
      createdAt: "2023-12-21T21:04:27.084Z",
      updatedAt: "2023-12-21T21:04:27.084Z",
    }
  ]

  async getUsers() {
    return this.users;
  }

  async getUserById(id: string) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    delete userFound.refreshToken
    delete userFound.recoveryToken
    return userFound;
  }

  async getUserByEmail(email: string) {
    const userFound = this.users.find(user => user.email === email)
    if (!userFound) {
      throw new NotFoundException('user not found')
    }
    return userFound;
  }

  async createUser(data: any) {
    const emailExists = this.users.some((user) => user.email === data.email);
    if (emailExists) {
      throw new ConflictException(`the email '${data.email}' already exists`)
    }
    const profileId = v4();
    const userId = v4()
    const newUser = {
      id: userId,
      ...data,
      role: Role.NORMAL,
      refreshToken: [],
      recoveryToken: [],
      profileId: profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await this.profileService.createProfile(profileId, userId, data.username);
    this.users.push(newUser);
    return { message: 'new user created'}
  }

  async updateUser(id: string, changes: any) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    const updatedUser = Object.assign(userFound, changes);
    return updatedUser;
  }

  async saveRefreshToken(id: string, refreshToken: string) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found')
    }
    const newRefreshTokenArray = userFound.refreshToken.filter((rt) => rt ==! refreshToken);
    userFound.refreshToken = [...newRefreshTokenArray, refreshToken]
    Object.assign(userFound.refreshToken);
  }

  async removeRefreshToken(id: string, refreshToken: string) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found')
    }
    const newRefreshTokenArray = userFound.refreshToken.filter((rt) => rt ==! refreshToken);
    userFound.refreshToken = [...newRefreshTokenArray];
    Object.assign(userFound.refreshToken);
  }

  async deleteUser(id: string) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    return this.users.filter(user => user.id !== userFound.id);
  }
}
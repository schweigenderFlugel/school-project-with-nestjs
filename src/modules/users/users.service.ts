import { Injectable, Inject, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Role } from '../../common/models/roles.model'; 
import { UsersRepository } from './users.repository';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: IUsersRepository
  ) {}

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

  async getUserById(id: number) {
    const userFound = await this.usersRepository.findOne(id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    delete userFound.refreshToken
    delete userFound.recoveryToken
    return userFound;
  }

  async getUserByEmail(email: string) {
    const userFound = await this.usersRepository.findByEmail(email);
    if (!userFound) {
      throw new NotFoundException('user not found!')
    }
    return userFound;
  }

  async createUser(data: any) {
    const userFound = await this.usersRepository.findByEmail(data.email);
    if (userFound) {
      throw new ConflictException('the email already exists')
    }
    await this.usersRepository.createUser(data);
    return { message: 'new user created' }
  }

  async updateUser(id: string, changes: any) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    const updatedUser = Object.assign(userFound, changes);
    return updatedUser;
  }

  async saveRefreshToken(id: number, refreshToken: string) {
    try {
      const userFound = await this.usersRepository.findOne(id);
      const newRefreshTokenArray = userFound.refreshToken.filter(rt => rt !== refreshToken);
      userFound.refreshToken = [...newRefreshTokenArray, refreshToken]
      console.log(newRefreshTokenArray)
      const session = new Users(userFound.refreshToken, id);
      await this.usersRepository.saveRefreshToken(session)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateRefreshToken(id: number, refreshToken: string, newRefreshToken: string) {
    try {
      const userFound = await this.usersRepository.findOne(id);
      const newRefreshTokenArray = userFound.refreshToken.filter(rt => rt !== refreshToken);
      userFound.refreshToken = [...newRefreshTokenArray, newRefreshToken]
      console.log(newRefreshTokenArray)
      const session = new Users(userFound.refreshToken, id);
      await this.usersRepository.saveRefreshToken(session)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeRefreshToken(id: number) {
    const session = new Users([], id)
    await this.usersRepository.removeRefreshToken(session)
  }

  async deleteUser(id: string) {
    const userFound = this.users.find(user => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    return this.users.filter(user => user.id !== userFound.id);
  }
}
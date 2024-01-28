import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Role } from '../../common/models/roles.model';
import { UsersRepository } from './users.repository';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { Users } from './users.entity';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: IUsersRepository,
    private readonly profileService: ProfileService,
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
      createdAt: '2023-12-21T20:08:43.084Z',
      updatedAt: '2023-12-21T20:08:43.084Z',
    },
    {
      id: '54f47a6a-5b36-4738-99d4-b34723c9e2dc',
      email: 'normal@email.com',
      password: '$2b$10$JclD5ZmslCCbQApatOy3fOA3/GWnkgRb6T4EYMLxn44z8vtxEuQIu',
      refreshToken: [],
      recoveryToken: [],
      role: Role.NORMAL,
      profileId: '2',
      createdAt: '2023-12-21T21:04:27.084Z',
      updatedAt: '2023-12-21T21:04:27.084Z',
    },
  ];

  async getUsers() {
    return this.usersRepository.getAll();
  }

  async getUserById(id: number) {
    const userFound = await this.usersRepository.findOne(id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    delete userFound.refreshToken;
    delete userFound.recoveryToken;
    return userFound;
  }

  async getUserByEmail(email: string) {
    const userFound = await this.usersRepository.findByEmail(email);
    if (!userFound) {
      throw new NotFoundException('user not found!');
    }
    return userFound;
  }

  async createUser(data: any) {
    try {
      const profileId = await this.profileService.createProfile();
      data.profileId = profileId;
      await this.usersRepository.create(data);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async updateUser(id: string, changes: any) {
    const userFound = this.users.find((user) => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    const updatedUser = Object.assign(userFound, changes);
    return updatedUser;
  }

  async saveRefreshToken(id: number, jwtCookie: string, refreshToken: string) {
    const userFound = await this.usersRepository.findOne(id);
    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== jwtCookie,
    );
    userFound.refreshToken = [...newRefreshTokenArray, refreshToken];
    const session = new Users(userFound.refreshToken, id);
    await this.usersRepository.saveRefreshToken(session);
  }

  async removeRefreshToken(id: number, jwtCookie: string) {
    const userFound = await this.usersRepository.findOne(id);
    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== jwtCookie,
    );
    userFound.refreshToken = [...newRefreshTokenArray];
    const session = new Users(userFound.refreshToken, id);
    await this.usersRepository.removeRefreshToken(session);
  }

  async deleteUser(id: string) {
    const userFound = this.users.find((user) => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    return this.users.filter((user) => user.id !== userFound.id);
  }
}

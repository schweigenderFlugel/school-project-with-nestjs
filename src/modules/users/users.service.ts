import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Role, RoleTypes } from '../../common/models/roles.model';
import { UsersRepository } from './users.repository';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: IUsersRepository,
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

  async getUserById(id: number) {
    const userFound = await this.usersRepository.findOne(id);
    if (!userFound) {
      throw new NotFoundException('user not found!');
    }
    return userFound;
  }

  async getUserByEmail(email: string) {
    const userFound = await this.usersRepository.findByEmail(email);
    if (!userFound) {
      throw new NotFoundException('user not found!');
    }
    return userFound;
  }

  async createUser(data: any, activationCode: string) {
    try {
      data.activationCode = activationCode;
      await this.usersRepository.create(data);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async activateRegister(code: string) {
    const userFound = await this.usersRepository.findByCode(code);
    if (userFound.activationCode === code) {
      const changes = new Users();
      changes.id = userFound.id;
      changes.email = userFound.email;
      changes.password = userFound.password;
      changes.activationCode = null;
      changes.isActive = true;
      await this.usersRepository.update(changes);
    }
  }

  async saveRefreshToken(id: number, jwtCookie: string, refreshToken: string) {
    const userFound = await this.getUserById(id);
    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== jwtCookie,
    );
    userFound.refreshToken = [...newRefreshTokenArray, refreshToken];
    const changes = new Users();
    changes.id = id;
    changes.refreshToken = userFound.refreshToken;
    await this.usersRepository.update(changes);
  }

  async removeRefreshToken(id: number, jwtCookie: string) {
    const userFound = await this.getUserById(id);
    const newRefreshTokenArray = userFound.refreshToken.filter(
      (rt) => rt !== jwtCookie,
    );
    userFound.refreshToken = [...newRefreshTokenArray];
    const user = new Users();
    user.id = id;
    user.refreshToken = userFound.refreshToken;
    await this.usersRepository.update(user);
  }

  async changeRole(id: number, role: RoleTypes) {
    await this.getUserById(id);
    const user = new Users();
    user.id = id;
    user.role = role;
    await this.usersRepository.update(user);
  }

  async deleteUser(id: string) {
    const userFound = this.users.find((user) => user.id === id);
    if (!userFound) {
      throw new NotFoundException('user not found');
    }
    return this.users.filter((user) => user.id !== userFound.id);
  }
}

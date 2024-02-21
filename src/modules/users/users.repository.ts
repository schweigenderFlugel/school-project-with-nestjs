import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Users } from './users.entity';
import { IUsersRepository } from './interfaces/users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  repository: Repository<Users>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Users);
  }

  async findOne(id: number): Promise<Users | null> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await this.repository.findOne({
      where: { email: email },
    });
  }

  async findByCode(code: string): Promise<Users | null> {
    return await this.repository.findOne({
      where: { activationCode: code },
    });
  }

  async create(newUser: Users): Promise<Users> {
    const createUser = this.repository.create(newUser);
    return await this.repository.save(createUser);
  }

  async update(changes: Partial<Users>): Promise<void> {
    await this.repository.save(changes);
  }

  async delete(id: number): Promise<void> {
    const userFound = await this.repository.findOne({
      where: { id: id },
    });
    await this.repository.remove(userFound);
  }
}

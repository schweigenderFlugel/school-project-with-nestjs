import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { Users } from "./users.entity";
import { ICreateUser } from "./interfaces/users.interface";
import { IUsersRepository } from "./interfaces/users.repository.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {
  repository: Repository<Users>
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Users)
  }

  async getAll() {
    return await this.repository.find()
  }

  async findOne(id: number): Promise<Users | null> {
    return this.repository.findOne({
      where: { id: id },
    })
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.repository.findOne({
      where: { email: email },
    })
  }

  async create(newUser: ICreateUser): Promise<Users> {
    const createUser = this.repository.create(newUser);
    return await this.repository.save(createUser);
  }

  async saveRefreshToken(session: Users): Promise<void> {
    await this.repository.save(session);
  }

  async removeRefreshToken(session: Users): Promise<void> {
    await this.repository.save(session);
  }

  async delete(id: number): Promise<void> {
    const userFound = await this.repository.findOne({
      where: { id: id },
      relations: ['profile']
    })
    await this.repository.remove(userFound)
  }
}
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Profile } from './profile.entity';
import { IProfileRepository } from './interfaces/profile.repository.interface';
import { IUpdateProfile } from './interfaces/profile.interface';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  repository: Repository<Profile>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Profile);
  }

  async findById(id: number): Promise<Profile> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async create(): Promise<Profile> {
    const newProfile = this.repository.create()
    return await this.repository.save(newProfile);
  }

  async update(changes: IUpdateProfile): Promise<Profile> {
    return await this.repository.save(changes);
  }
}

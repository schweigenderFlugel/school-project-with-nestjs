import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Profile } from './profile.entity';
import { IProfileRepository } from './interfaces/profile.repository.interface';
import { ICreateProfile, IUpdateProfile } from './interfaces/profile.interface';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  repository: Repository<Profile>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Profile)
  }

  async findOne(id: number): Promise<Profile> {
    return this.repository.findOne({
      where: { id: id },
      relations: ['user']
    })
  }

  async save(id: number, data: ICreateProfile): Promise<Profile> {
    const newProfile = this.repository.create({
      userId: id,
      ...data
    })
    return this.repository.save(newProfile)
  }

  async update(changes: IUpdateProfile): Promise<Profile> {
    return await this.repository.save(changes)
  }
}
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DiscordAuth } from './discord-auth.entity';
import { IDiscordAuthRepository } from './interfaces/discord-auth.repository.interface';
import { IDiscordAuthCreate, IDiscordAuthUpdate } from './interfaces/discord-auth.interface';

@Injectable()
export class DiscordAuthRepository implements IDiscordAuthRepository {
  repository: Repository<DiscordAuth>;
  constructor(private discordAuthRepository: DataSource) {
    this.repository = this.discordAuthRepository.getRepository(DiscordAuth);
  }

  async findByDiscordId(discordId: string): Promise<DiscordAuth> {
    return await this.repository.findOne({
      where: { discordId: discordId },
    });
  }

  async save(data: IDiscordAuthCreate): Promise<DiscordAuth> {
    const newUser = this.repository.create(data);
    return await this.repository.save(newUser);
  }

  async update(changes: IDiscordAuthUpdate): Promise<void> {
    await this.repository.save(changes);
  }

  async saveRefreshToken(session: DiscordAuth): Promise<void> {
    await this.repository.save(session);
  }

  async removeRefreshToken(session: DiscordAuth): Promise<void> {
    await this.repository.save(session);
  }

}

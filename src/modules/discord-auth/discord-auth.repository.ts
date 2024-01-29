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
      relations: {
        profileId: true,
      },
    });
  }

  async save(data: IDiscordAuthCreate): Promise<void> {
    const newUser = this.repository.create(data);
    await this.repository.save(newUser);
  }

  async update(changes: IDiscordAuthUpdate): Promise<void> {
    await this.repository.save(changes);
  }
}

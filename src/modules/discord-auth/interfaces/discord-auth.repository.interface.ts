import { DiscordAuth } from '../discord-auth.entity';
import { IDiscordAuthCreate, IDiscordAuthUpdate } from './discord-auth.interface';

export interface IDiscordAuthRepository {
  findByDiscordId(email: string): Promise<DiscordAuth>;
  save(data: IDiscordAuthCreate): Promise<void>;
  update(changes: IDiscordAuthUpdate): Promise<void>;
}

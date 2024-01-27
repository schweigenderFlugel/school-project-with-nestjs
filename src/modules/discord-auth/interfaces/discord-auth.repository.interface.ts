import { DiscordAuth } from '../discord-auth.entity';
import { IDiscordAuthCreate } from './discord-auth.interface';

export interface IDiscordAuthRepository {
  findByDiscordId(email: string): Promise<DiscordAuth>;
  save(data: IDiscordAuthCreate): Promise<void>;
}

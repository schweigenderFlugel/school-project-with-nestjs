import { DiscordAuth } from '../discord-auth.entity';
import {
  IDiscordAuthCreate,
  IDiscordAuthUpdate,
} from './discord-auth.interface';

export interface IDiscordAuthRepository {
  findByDiscordId(email: string): Promise<DiscordAuth>;
  save(data: DiscordAuth): Promise<DiscordAuth>;
  update(changes: Partial<DiscordAuth>): Promise<void>;
  saveRefreshToken(session: DiscordAuth): Promise<void>;
  removeRefreshToken(session: DiscordAuth): Promise<void>;
}

import { Profile } from 'src/modules/profile/profile.entity';

export interface IDiscordAuthCreate {
  profile: Profile | number;
  discordId: string;
  username: string;
  email: string;
  avatar: string;
  discriminator: string;
}

export interface IDiscordAuthUpdate {
  id: number;
  username?: string;
  avatar?: string;
}

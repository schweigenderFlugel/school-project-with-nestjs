import { Profile } from 'src/modules/profile/profile.entity';

export interface IDiscordAuthCreate {
  profileId: Profile | number;
  discordId: string;
  username: string;
  email: string;
  avatar: string;
  discriminator: string;
}

export interface IDiscordAuthUpdate {
  discordId: string;
  profileId?: Profile | number;
  username?: string;
  email?: string;
  avatar?: string;
  discriminator?: string;
}


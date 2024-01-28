import { Profile } from 'src/modules/profile/profile.entity';

export interface IDiscordAuthCreate {
  profileId: Profile;
  discordId: string;
  username: string;
  email: string;
  avatar: string;
  discriminator: string;
}

import { Role } from '../../common/models/roles.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Entity({ name: 'discord-auth' })
export class DiscordAuth {
  constructor(
    profileId: any,
    discordId: string,
    username: string,
    email: string,
    avatar: string,
    discriminator: string,
    refreshToken: string,
  ) {
    (this.profileId = profileId),
      (this.discordId = discordId),
      (this.username = username),
      (this.email = email),
      (this.avatar = avatar),
      (this.discriminator = discriminator),
      (this.refreshToken = refreshToken);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profileId: Profile;

  @Column({ name: 'discord_id', type: 'varchar', unique: true })
  discordId: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  discriminator: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ default: Role.NORMAL })
  role: string;
}

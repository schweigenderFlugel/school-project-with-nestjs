import { Role } from 'src/common/models/roles.model';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'discord-auth' })
export class DiscordAuth {
  constructor(
    discordId: string, 
    username: string, 
    email: string, 
    avatar: string, 
    discriminator: string,
    refreshToken: string,
    ) {
      this.discordId = discordId,
      this.username = username,
      this.email = email,
      this.avatar = avatar,
      this.discriminator = discriminator,
      this.refreshToken = refreshToken
    }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discord_id', type: 'varchar', unique: true })
  discordId: string

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  discriminator: string; 

  @Column({ name: 'refresh_token'})
  refreshToken: string;

  @Column({ default: Role.NORMAL })
  role: string;

  @Column({ name: 'profile-id'})
  profileId: string;
}
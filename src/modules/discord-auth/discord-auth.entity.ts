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
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile | number;

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

  @Column({ default: Role.NORMAL })
  role: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'refresh_token', type: 'json', nullable: true, default: '[]' })
  refreshToken: string[];
}

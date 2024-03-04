import { Role } from '../../common/models/roles.model';
import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Base } from 'src/common/entity/base.entity';

@Entity({ name: 'discord-auth' })
export class DiscordAuth extends Base {
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

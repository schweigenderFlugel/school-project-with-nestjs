import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Base } from 'src/common/entity/base.entity';
import { Profile } from '../profile/profile.entity';
import { Role } from 'src/common/models/roles.model';

@Entity({ name: 'users' })
export class Users extends Base {
  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile | number;

  @Column({ type: 'varchar', length: '255', unique: true })
  email: string;

  @Column({ type: 'varchar', length: '255' })
  password: string;

  @Column({ name: 'refresh_token', type: 'json', nullable: true, default: '[]' })
  refreshToken: string[];

  @Column({ name: 'recovery_token', type: 'json', nullable: true, default: '[]' })
  recoveryToken: string[];

  @Column({ default: Role.NORMAL })
  role: string;

  @Column({ name: 'activation_code', type: 'varchar', length: '16', nullable: true })
  activationCode: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;
}

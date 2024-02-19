import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../common/models/roles.model';
import { Profile } from '../profile/profile.entity';

@Entity({ name: 'users' })
export class Users {
  constructor(refreshToken: string[], id: number) {
    this.id = id;
    this.refreshToken = refreshToken;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (users) => users.profile)
  user: Users;

  @Column({ type: 'varchar', length: '15', unique: true, nullable: true })
  username: string;

  @Column({ name: 'full_name', type: 'varchar', length: '50', nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  address: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

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

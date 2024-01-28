import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (users) => users.profileId)
  user: Users;

  @Column({ type: 'varchar', length: '15', unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  address: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;
}

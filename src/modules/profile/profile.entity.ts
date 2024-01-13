import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'profile' })
export class Profile {
  constructor(userId: any, username: string) {
    this.user = userId,
    this.username = username
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;
  
  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'bigint' })
  phone: number;

  @Column({ type: 'text'})
  imageUrl: string;

  @Column({ type: 'text'})
  description: string;

  @OneToOne(() => Users, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
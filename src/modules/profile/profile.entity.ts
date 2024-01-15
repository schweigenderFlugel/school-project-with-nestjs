import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'profile' })
export class Profile {
  constructor(userId: any) {
    this.user = userId
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  fullName: string;
  
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
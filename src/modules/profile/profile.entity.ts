import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;
  
  @Column()
  address: string;

  @Column()
  phone: number;

  @Column()
  imageUrl: string;

  @Column()
  description: string;

  @OneToOne(() => Users, (users) => users.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
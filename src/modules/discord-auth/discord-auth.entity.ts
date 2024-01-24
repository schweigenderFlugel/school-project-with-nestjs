import { Entity, Column } from 'typeorm';

@Entity()
export class AuthEntity {
  @Column()
  id: number;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column()
  discriminator: string; 
}
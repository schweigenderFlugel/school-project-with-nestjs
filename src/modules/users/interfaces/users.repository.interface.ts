import { Users } from '../users.entity';

export interface IUsersRepository {
  getAll(): Promise<Users[]>;
  findOne(id: number): Promise<Users | null>;
  findByEmail(email: string): Promise<Users | null>;
  create(newUser: Users): Promise<Users>;
  update(changes: Partial<Users>): Promise<void>;
  delete(id: number): Promise<void>;
}

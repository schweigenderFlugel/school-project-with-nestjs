import { Users } from '../users.entity';

export interface IUsersRepository {
  findOne(id: number): Promise<Users | null>;
  findByEmail(email: string): Promise<Users | null>;
  findByCode(code: string): Promise<Users | null>;
  create(newUser: Users): Promise<Users>;
  update(changes: Partial<Users>): Promise<void>;
  delete(id: number): Promise<void>;
}

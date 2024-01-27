import { Users } from '../users.entity';
import { ICreateUser } from './users.interface';

export interface IUsersRepository {
  getAll(): Promise<Users[]>;
  findOne(id: number): Promise<Users | null>;
  findByEmail(email: string): Promise<Users | null>;
  create(newUser: ICreateUser): Promise<Users>;
  saveRefreshToken(session: Users): Promise<void>;
  removeRefreshToken(session: Users): Promise<void>;
}

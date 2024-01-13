import { Users } from "../users.entity";
import { ICreateUser } from "./users.interface";

export interface IUsersRepository {
  getAll(): Promise<Users[]>;
  findOne(id: number): Promise<Users | null>;
  findByEmail(email: string): Promise<Users | null>
  createUser(newUser: ICreateUser): Promise<void>;
  saveRefreshToken(session: Users): Promise<void>;
  removeRefreshToken(session: Users): Promise<void>;
}
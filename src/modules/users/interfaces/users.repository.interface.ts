import { Users } from "../users.entity";
import { ICreateUser, IUpdateUser } from "./users.interface";

export interface IUsersRepository {
  getAll(): Promise<Users[]>;
  findOne(id: number): Promise<Users | null>;
  save(newUuser: ICreateUser): Promise<Users>;
  update(changes: IUpdateUser): Promise<Users>;
  delete(id: number): Promise<void>;
}
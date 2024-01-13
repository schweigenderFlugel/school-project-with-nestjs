import { Role } from "src/common/models/roles.model";

export interface ICreateUser {
  id: number,
  email: string,
  password: string,
  refreshToken: string[],
  recoveryToken: string[],
  role: Role,
  profileId: number,
  createdAt: Date,
  updatedAt: Date
}

export interface IUpdateUser {
  id: number,
  email?: string,
  password?: string,
  refreshToken?: string[]
  recoveryToken?: string[],
  role?: Role,
  profileId?: number,
  createdAt?: Date,
  updatedAt?: Date
}
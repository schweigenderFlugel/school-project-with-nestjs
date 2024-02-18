import { Role } from "../models/roles.model";
import { UsersFixture } from "./types.fixture";

export const adminUser: UsersFixture = {
  id: 1,
  email: 'admin@email.com',
  password: '',
  role: Role.ADMIN,
  isActive: true,
}

export const normalUser: UsersFixture = {
  id: 2,
  email: 'normal@email.com',
  password: '',
  role: Role.NORMAL,
  isActive: true,
}

export const usersFixture = [adminUser, normalUser];
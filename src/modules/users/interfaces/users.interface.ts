import { Role } from 'src/common/models/roles.model';
import { Profile } from 'src/modules/profile/profile.entity';

export interface ICreateUser {
  id: number;
  email: string;
  username: string;
  password: string;
  refreshToken: string[];
  recoveryToken: string[];
  profile: Profile;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUser {
  id: number;
  email?: string;
  username?: string;
  password?: string;
  refreshToken?: string[];
  recoveryToken?: string[];
  profile?: Profile;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

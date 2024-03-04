import { Profile } from "src/modules/profile/profile.entity";

export interface NewUser {
  email: string;
  password: string;
  profile: Profile | number;
  activationCode: string;
}
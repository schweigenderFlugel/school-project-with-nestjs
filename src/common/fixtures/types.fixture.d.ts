import { OmitType } from "@nestjs/swagger";
import { Category } from "src/modules/category/category.entity";
import { Profile } from "src/modules/profile/profile.entity";
import { Users } from "src/modules/users/users.entity";

export class UsersFixture extends OmitType(Users, [
  'createdAt',
  'updatedAt',
  'refreshToken',
  'recoveryToken',
  'profileId',
] as const) {}

export class ProfileFixture extends OmitType(Profile, [
  'createdAt',
  'updatedAt',
] as const) {
  user: number;
}

export class CategoryFixture extends OmitType(Category, [
  'createdAt',
  'updatedAt',
] as const) {}

interface FixturesTree {
  Users: UsersFixture[];
  Profile: ProfileFixture[];
  Category: CategoryFixture[];
}
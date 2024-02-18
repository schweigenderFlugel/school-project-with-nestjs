import { FixturesTree } from "./types.fixture";
import { adminProfile, normalProfile } from "./profile";
import { adminUser, normalUser } from "./users";
import { category1, category2, category3 } from "./category";

export const fixturesTree: FixturesTree = {
  Users: [adminUser, normalUser],
  Profile: [adminProfile, normalProfile],
  Category: [category1, category2, category3],
}
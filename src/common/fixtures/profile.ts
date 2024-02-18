import { ProfileFixture } from "./types.fixture";
import { adminUser, normalUser } from "./users";

export const adminProfile: ProfileFixture = {
  id: 1,
  username: 'admin',
  fullName: 'administrator',
  address: 'Callao 123',
  phone: 2610000000,
  description: 'this is a administrator of the website',
  imageUrl: 'image',
  user: adminUser.id,
}

export const normalProfile: ProfileFixture = {
  id: 2,
  username: 'normal',
  fullName: 'normal user',
  address: 'Callao 123',
  phone: 2610000000,
  description: 'this is a normal user',
  imageUrl: 'image',
  user: adminUser.id,
}

export const profileFixture = [adminProfile, normalProfile];
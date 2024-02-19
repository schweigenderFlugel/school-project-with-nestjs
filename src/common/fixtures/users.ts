import { Role } from "../models/roles.model";
import { adminProfile, normalProfile } from "./profile";
import { UsersFixture } from "./types.fixture";

export const adminUser: UsersFixture = {
  id: 1,
  email: 'admin@email.com',
  password: '',
  role: Role.ADMIN,
  isActive: true,
  profile: adminProfile.id
}

export const normalUser: UsersFixture = {
  id: 2,
  email: 'normal@email.com',
  password: '',
  role: Role.NORMAL,
  isActive: true,
  profile: normalProfile.id
}

export const normalAccessToken = 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGY0N2E2YS01YjM2LTQ3MzgtOTlkNC1iMzQ3MjNjOWUyZGMiLCJyb2xlIjoibm9ybWFsIiwiaWF0IjoxNzA0NjAwNjg1fQ.XxKQNbDtVEka1-Gh6CvcPGYpQSvTyoQlrnaKPmsOpVg';
export const adminAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODNiZmQzNC1kMzY4LTQ5ODEtOTBkYy04NDgxZTQ1ZTkxZGEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDQ2MDA3NDZ9.iPwnpUIJWkbYpKTjg_vcMxD_bjf3Tt06UXDIGA3hln8';

export const usersFixture = [adminUser, normalUser];
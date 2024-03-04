import { Request } from "express";

export interface Payload {
  id: number;
  role: string;
  profile: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserRequest extends Request {
  user: Payload;
}
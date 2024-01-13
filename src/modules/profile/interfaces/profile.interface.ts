import { Users } from "../../users/users.entity";

export interface ICreateProfile {
    id: number;
    username: string;
    address: string;
    phone: number;
    userId: Users
}

export interface IUpdateProfile {
    id: number;
    username?: string;
    address?: string;
    phone?: number;
    userId?: Users
}
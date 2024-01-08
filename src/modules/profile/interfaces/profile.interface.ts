import { Users } from "../../users/users.entity";

export interface IUpdateProfile {
    id: number;
    username?: string;
    address?: string;
    phone?: number;
    userId?: Users
}
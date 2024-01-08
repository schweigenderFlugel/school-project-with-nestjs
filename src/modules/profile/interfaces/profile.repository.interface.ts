import { Profile } from "../profile.entity";
import { IUpdateProfile } from "./profile.interface";

export interface IProfileRepository {
    findOne(id: number): Promise<Profile | null>
    update(changes: IUpdateProfile): Promise<Profile>
}
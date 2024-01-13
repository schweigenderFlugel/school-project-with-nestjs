import { Profile } from "../profile.entity";
import { ICreateProfile, IUpdateProfile } from "./profile.interface";

export interface IProfileRepository {
    findOne(id: number): Promise<Profile | null>
    save(id: number, data: ICreateProfile): Promise<Profile>
    update(changes: IUpdateProfile): Promise<Profile>
}
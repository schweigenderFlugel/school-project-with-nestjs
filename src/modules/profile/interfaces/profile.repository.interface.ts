import { Profile } from "../profile.entity";
import { IUpdateProfile } from "./profile.interface";

export interface IProfileRepository {
    findOne(id: number): Promise<Profile | null>
    create(newProfile: Profile): Promise<void>
    update(changes: IUpdateProfile): Promise<Profile>
}
import { Profile } from "../profile.entity";
import { IUpdateProfile } from "./profile.interface";

export interface IProfileRepository {
    findByUserId(id: number): Promise<Profile | null>;
    create(newProfile: Profile): Promise<void>;
    update(changes: IUpdateProfile): Promise<Profile>;
}
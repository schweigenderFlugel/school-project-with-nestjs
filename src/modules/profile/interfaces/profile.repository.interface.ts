import { Profile } from '../profile.entity';
import { IUpdateProfile } from './profile.interface';

export interface IProfileRepository {
  findById(id: number): Promise<Profile | null>;
  create(): Promise<Profile>;
  update(changes: IUpdateProfile): Promise<Profile>;
}

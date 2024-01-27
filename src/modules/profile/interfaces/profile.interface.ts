export interface IUpdateProfile {
  id: number;
  username: string;
  fullName: string;
  address?: string;
  phone?: number;
  description?: string;
  imageUrl?: string;
}

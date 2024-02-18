import { Category } from "./category.entity";

export interface ICategoryInterface {
  getAll(limit?: number, offset?: number): Promise<Category[]>;
  getOne(id: number): Promise<Category | null>;
  create(data: Category): Promise<Category>;
  update(changes: Category): Promise<Category | null>;
  delete(id: number): Promise<void>; 
}
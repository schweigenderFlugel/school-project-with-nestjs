import { Injectable } from "@nestjs/common";
import { Repository, DataSource } from "typeorm";
import { Category } from "./category.entity";
import { ICategoryInterface } from "./category.repository.interface";

@Injectable()
export class CategoryRepository implements ICategoryInterface{
  repository: Repository<Category>;
  constructor(private readonly dataSource: DataSource){
    this.repository = this.dataSource.getRepository(Category);
  }

  async getAll(limit?: number, offset?: number): Promise<Category[]> {
    if(limit && offset) {
      return await this.repository.find({
        take: limit,
        skip: offset,
      });
    }
    return await this.repository.find();
  }

  async getOne(id: number): Promise<Category> {
    return await this.repository.findOne({
        where: { id: id }
    })
  }

  async create(data: Category): Promise<Category> {
    const newCategory = this.repository.create(data);
    return await this.repository.save(newCategory);
  }

  async update(changes: Partial<Category>): Promise<Category> {
    return await this.repository.save(changes);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id)
  }
}
import { Injectable, Inject, NotFoundException, ConflictException } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { ICategoryInterface } from "./category.repository.interface";
import { Category } from "./category.entity";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepository) private readonly categoryRepository: ICategoryInterface
  ) {}

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.getAll()
  }

  async getOne(id: number): Promise<Category> {
    const categoryFound = await this.categoryRepository.getOne(id);
    if (!categoryFound) throw new NotFoundException('category not found!');
    return categoryFound;
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = new Category();
      newCategory.name = data.name;
      newCategory.description = data.description;
      return await this.categoryRepository.create(newCategory);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    await this.getOne(id);
    const updateCategory = new Category();
    updateCategory.name = data.name;
    updateCategory.description = data.description;
    return await this.categoryRepository.update(updateCategory);
  }

  async delete(id: number) {
    await this.getOne(id);
    await this.categoryRepository.delete(id);
  }
}
import { Injectable, Inject, NotFoundException, ConflictException } from "@nestjs/common";
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

import { CategoryRepository } from "./category.repository";
import { ICategoryInterface } from "./category.repository.interface";
import { Category } from "./category.entity";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ENVIRONMENTS } from '../../environments';

dotenv.config();

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepository) private readonly categoryRepository: ICategoryInterface,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAll(limit?: number, offset?: number): Promise<Category[]> {
    return await this.categoryRepository.getAll(limit, offset)
  }

  async getOne(id: number): Promise<Category> {
    const categoryFound = await this.categoryRepository.getOne(id);
    if (!categoryFound) throw new NotFoundException('category not found!');
    return categoryFound;
  }

  async create(data: CreateCategoryDto, image: Express.Multer.File): Promise<Category> {
    try {
      if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
        const result = await this.cloudinaryService.uploadFile(image, 'categories');
        const newCategory = new Category();
        newCategory.name = data.name;
        newCategory.description = data.description;
        newCategory.imageUrl = result.secure_url;
        newCategory.publicId = result.public_id;
        return await this.categoryRepository.create(newCategory);
      } else {
        const newCategory = new Category();
        newCategory.name = data.name;
        newCategory.description = data.description;
        newCategory.imageUrl = image.path;
        return await this.categoryRepository.create(newCategory);
      }
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async update(id: number, changes: UpdateCategoryDto, image: Express.Multer.File): Promise<Category> {
    const categoryFound = await this.getOne(id);
    if (process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION) {
      const result = await this.cloudinaryService.uploadFile(image, 'categories');
      const updateCategory = new Category();
      updateCategory.name = changes.name;
      updateCategory.description = changes.description;
      updateCategory.imageUrl = result.secure_url;
      updateCategory.publicId = result.public_id;
      return await this.categoryRepository.update(updateCategory);
    } else {
      fs.unlink(`${categoryFound.imageUrl}`, (err) => {
        if (err) {
          const updateCategory = new Category();
          updateCategory.name = changes.name;
          updateCategory.description = changes.description;
          updateCategory.imageUrl = image?.path;
          return this.categoryRepository.update(updateCategory)
        }
      })
      const updateCategory = new Category();
      updateCategory.name = changes.name;
      updateCategory.description = changes.description;
      updateCategory.imageUrl = image?.path;
      return await this.categoryRepository.update(updateCategory);
    }
  }

  async delete(id: number) {
    const categoryFound = await this.getOne(id);
    await this.cloudinaryService.deleteFile(categoryFound.publicId);
    await this.categoryRepository.delete(id);
  }
}
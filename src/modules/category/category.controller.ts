import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return await this.categoryService.getAll()
  }

  @Get(':id')
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getOne(id)
  }

  @Post()
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.categoryService.create(data);
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number, 
    @Body() changes: UpdateCategoryDto) {
      return await this.categoryService.update(id, changes);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id)
  }
}
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { IsPublic } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { Role } from "src/common/models/roles.model";

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsPublic()
  @ApiOperation({ summary: 'get all the categories '})
  @Get()
  async getCategories() {
    return await this.categoryService.getAll()
  }

  @IsPublic()
  @ApiOperation({ summary: 'get a category by id '})
  @Get(':id')
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getOne(id)
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'create a new category'})
  @Post()
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.categoryService.create(data);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'update a category'})
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number, 
    @Body() changes: UpdateCategoryDto) {
      return await this.categoryService.update(id, changes);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'delete a category'})
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id)
  }
}
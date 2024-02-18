import { 
  Controller, 
  Get,
  Post, 
  Put, 
  Delete, 
  Param, 
  Query,
  Body, 
  ParseIntPipe, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile 
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { IsPublic } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { Role } from "src/common/models/roles.model";
import { uploadFileConfig } from "src/file-upload.config";

@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsPublic()
  @ApiOperation({ summary: 'get all the categories '})
  @Get()
  async getCategories(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return await this.categoryService.getAll(limit, offset)
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
  @UseInterceptors(FileInterceptor('image', uploadFileConfig('categories', ['image/jpeg', 'image/png'])))
  async createCategory(
    @Body() data: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File
    ) {
    return await this.categoryService.create(data, image);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'update a category'})
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', uploadFileConfig('categories', ['image/jpeg', 'image/png'])))
  async updateCategory(
    @Param('id', ParseIntPipe) id: number, 
    @Body() changes: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    ) {
      return await this.categoryService.update(id, changes, image);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'delete a category'})
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id)
  }
}
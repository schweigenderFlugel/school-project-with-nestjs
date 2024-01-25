import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticlesDto, UpdateArticlesDto } from './articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getArticles() {
    return await this.articlesService.getArticles()
  }

  @Get(':id')
  async getArticleById(@Param('id') id: number) {
    return await this.articlesService.getArticleById(id);
  }

  @Post()
  async createArticle(@Body() data: CreateArticlesDto) {
    return this.articlesService.createArticle(data);
  }

  @Put(':id')
  async updateArticle(@Param('id') id: number, @Body() changes: UpdateArticlesDto) {
    return this.articlesService.updateArticle(id, changes);
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: number) {
    return this.articlesService.deleteArticle(id);
  }

}
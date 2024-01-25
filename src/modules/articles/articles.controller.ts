import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ArticlesService } from './articles.service';

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
  async createArticle(@Body() data: any) {
    return this.articlesService.createArticle(data);
  }
}
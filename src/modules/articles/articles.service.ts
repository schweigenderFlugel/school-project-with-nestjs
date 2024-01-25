import { Injectable, BadRequestException } from '@nestjs/common';
import * as util from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const articles = path.join(process.cwd() + '/src/modules/articles/data/articles.json')

@Injectable()
export class ArticlesService {
  articles: string;
  constructor() {
    this.articles = articles;
  }

  async getArticles(): Promise<[]> {
    const articles = await readFile(this.articles, 'utf-8');
    return JSON.parse(articles)
  }

  async getArticleById(id: number): Promise<object> {
    const data = await readFile(this.articles, 'utf-8');
    const article = JSON.parse(data);
    return article[id]
  }

  async createArticle(newData: any) {
    const data = await readFile(this.articles, 'utf-8');
    const articles = JSON.parse(data);
    const newArticleId = articles.lenght + 1;
    newData.id = newArticleId;
    articles.push(newData)
    const newArticle = JSON.stringify(articles, null, 2);
    await writeFile(this.articles, newArticle)
      .catch(error => {
        throw new BadRequestException(`error in the writing process: ${error}`)
      })
    return newData;
  }
}
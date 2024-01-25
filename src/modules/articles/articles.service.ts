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
    const newArticleId = articles.length + 1;
    console.log(newArticleId)
    newData.id = newArticleId;
    newData.createdDate = new Date();
    newData.updatedDate = new Date();
    articles.push(newData)
    const newArticle = JSON.stringify(articles, null, 2);
    await writeFile(this.articles, newArticle)
      .catch(error => {
        throw new BadRequestException(`error in the writing process: ${error}`)
      })
    return newData;
  }

  async updateArticle(id: number, changes: any) {
    const data = await readFile(this.articles, 'utf-8');
    const articles = JSON.parse(data);
    articles.forEach((article: any) => {
      if (article.id == id) {
        if (changes.keywords != undefined) article.keywords = changes.keywords;
        if (changes.title != undefined) article.title = changes.title;
        if (changes.author != undefined) article.author = changes.author;
        if (changes.abstract != undefined) article.abstract = changes.abstract;
        if (changes.body != undefined) article.body = changes.body;
        article.updatedDate = new Date();
        const newArticle = JSON.stringify(articles, null, 2)
        writeFile(this.articles, newArticle)
          .catch(error => {
            throw new BadRequestException(`error in the writing process: ${error}`)
        })
      }
    })
    return changes;
  }

  async deleteArticle(id: number) {
    const data = await readFile(this.articles, 'utf-8');
    const articles = JSON.parse(data);
    articles.forEach((article: any) => {
      if (article.id == id) {
        articles.splice(articles.indexOf(article), 1);
      }
      const deletedArticle = JSON.stringify(articles, null, 2);
      writeFile(this.articles, deletedArticle)
        .catch(error => {
          throw new BadRequestException(`error in the writing process: ${error}`)
      })
    })
    return { message: 'article erased successfully' };
  }
}
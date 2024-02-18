import { Controller, Body, Post } from "@nestjs/common";
import { DatabaseLoaderRepository } from "./loader.repository";

@Controller('loader')
export class DatabaseLoaderController {
  constructor(private readonly loaderRepository: DatabaseLoaderRepository) {}

  @Post()
  async loadFixtures(@Body() body: { fixtures: any[], entity: string }) {
    await this.loaderRepository.loadFixtures(body.fixtures, body.entity);
  }
}
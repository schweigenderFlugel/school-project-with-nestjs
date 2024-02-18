import { Injectable } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource } from "typeorm";

@Injectable()
export class DatabaseLoaderRepository {
  datasource: DataSource;
  constructor(dataSource: DataSource) {
    this.datasource = dataSource;
  }

  async loadFixtures(fixture: object[], entity: EntityClassOrSchema | string) {
    await this.datasource.getRepository(entity).save(fixture);
  }
}
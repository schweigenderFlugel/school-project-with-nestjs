import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseLoaderController } from "./loader.controller";
import { DatabaseLoaderRepository } from "./loader.repository";

@Module({
    imports: [TypeOrmModule.forFeature()],
    controllers: [DatabaseLoaderController],
    providers: [DatabaseLoaderRepository],
})
export class DatabaseLoaderModule {}
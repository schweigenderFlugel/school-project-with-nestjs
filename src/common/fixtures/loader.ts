import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { Users } from "src/modules/users/users.entity";
import { Profile } from "src/modules/profile/profile.entity";
import { Category } from "src/modules/category/category.entity";

import { usersFixture } from "./users";
import { profileFixture } from "./profile";
import { categoryFixture } from "./category";


export const loadFixtures = async (app: INestApplication) => {
  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: usersFixture, entity: Users.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: profileFixture, entity: Profile.name });

  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: categoryFixture, entity: Category.name });
}
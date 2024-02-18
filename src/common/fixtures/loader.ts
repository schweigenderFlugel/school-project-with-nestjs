import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { Users } from "src/modules/users/users.entity";
import { usersFixture } from "./users";

export const loadFixtures = async (app: INestApplication) => {
  await request(app.getHttpServer())
    .post('/loader')
    .send({ fixtures: usersFixture, entity: Users.name })
}
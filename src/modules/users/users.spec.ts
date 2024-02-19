import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from 'src/app.module'; 
import { loadFixtures } from 'src/common/fixtures/loader';
import { adminAccessToken, normalAccessToken } from 'src/common/fixtures/users';

describe('user', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await loadFixtures(app);
  });

  describe('GET /users', () => {
    it('should not be allowed to get users due to the lack of jwt', async () => {
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.statusCode).toEqual(401);
    });

    it('should not be allowed to get users because the role is wrong', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(normalAccessToken, { type: 'bearer' });
      expect(response.statusCode).toEqual(401);
    });

    it('should be allowed to get an array of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(adminAccessToken, { type: 'bearer' });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

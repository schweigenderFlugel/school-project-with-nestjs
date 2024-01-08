import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../../app.module';
import * as request from 'supertest';

describe('user', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication();
    app.init()
  })

  describe('GET /users', () => {
    it('should not be allowed to get users due to the lack of jwt', async () => {
      const response = await request(app.getHttpServer()).get('/users')
      expect(response.statusCode).toEqual(401)
    })

    it('should not be allowed to get users because the role is wrong', async () => {
      const normalAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGY0N2E2YS01YjM2LTQ3MzgtOTlkNC1iMzQ3MjNjOWUyZGMiLCJyb2xlIjoibm9ybWFsIiwiaWF0IjoxNzA0NjAwNjg1fQ.XxKQNbDtVEka1-Gh6CvcPGYpQSvTyoQlrnaKPmsOpVg'
      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(normalAccessToken, { type: 'bearer' })
        expect(response.statusCode).toEqual(401)
    })

    it('should be allowed to get an array of users', async () => {
      const adminAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODNiZmQzNC1kMzY4LTQ5ODEtOTBkYy04NDgxZTQ1ZTkxZGEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDQ2MDA3NDZ9.iPwnpUIJWkbYpKTjg_vcMxD_bjf3Tt06UXDIGA3hln8'
      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(adminAccessToken, { type: 'bearer' })
        expect(response.statusCode).toEqual(200)
        expect(response.body).toBeInstanceOf(Array)
    })
  })

  afterAll(async () => {
    await app.close();
  })
})
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as supertest from 'supertest'

describe('auth', () => {
  let app: INestApplication
    
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.init()
  })

  afterAll(async () => {
    await app.close()
  })
})
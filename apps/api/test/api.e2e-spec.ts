import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ApiModule } from '../src/api';

describe('ApiController (e2e)', () => {
  let api: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    api = moduleFixture.createNestApplication();
    await api.init();
  });

  it('/ (GET)', () => {
    return request(api.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

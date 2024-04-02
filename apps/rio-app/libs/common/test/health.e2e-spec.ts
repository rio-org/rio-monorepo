import {
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { HealthModule, HealthModuleOptions } from '../src';
import request from 'supertest';
import * as dns from 'dns';

describe('Health Tests', () => {
  let app: INestApplication;
  const redis = {
    host: 'host',
    port: 1234,
    db: 1,
    password: 'password',
    tls: false,
  };

  const database = {};
  let timer;

  const createApp = async (options: HealthModuleOptions) => {
    app = (
      await Test.createTestingModule({
        imports: [
          HealthModule.forRoot({
            ...options,
          }),
        ],
      }).compile()
    ).createNestApplication();
    await app.init();
  };

  afterEach(async () => {
    if (timer) clearTimeout(timer);
    await app.close();
    jest.restoreAllMocks();
  });

  describe('dns health check', () => {
    it('should return the metric and status ok when up', async () => {
      await createApp({});
      await request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({ status: 'ok', info: {}, error: {}, details: {} });
    });

    it('should return the metric and status ok when down', async () => {
      jest.spyOn(dns.promises, 'lookup').mockRejectedValue(new Error('hey'));

      await createApp({});
      await request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({ status: 'ok', info: {}, error: {}, details: {} });
    });
  });

  describe('redis health check', () => {
    it('should return the metric and status ok when up', async () => {
      const redisOk: HealthIndicatorResult = {
        redis: { status: 'up', message: '' },
      };
      jest
        .spyOn(MicroserviceHealthIndicator.prototype, 'pingCheck')
        .mockResolvedValue(redisOk);
      await createApp({ redis });
      await request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({
          status: 'ok',
          info: { ...redisOk },
          error: {},
          details: { ...redisOk },
        });
    });

    it('should return the metric and status not ok when down', async () => {
      await createApp({ redis });

      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(503);

      expect(response.body.status).toEqual('error');
      expect(response.body.info).toEqual({});
      expect(response.body.error.redis?.status).toEqual('down');
      expect(response.body.error.redis.message).toBeTruthy();
      expect(response.body.info).toEqual({});
      expect(response.body.details.redis?.status).toEqual('down');
      expect(response.body.details.redis.message).toBeTruthy();
    });
  });

  describe('database health check', () => {
    it('should return the metric and status ok when up', async () => {
      const databaseOk: HealthIndicatorResult = {
        database: { status: 'up', message: '' },
      };
      jest
        .spyOn(TypeOrmHealthIndicator.prototype, 'pingCheck')
        .mockResolvedValue(databaseOk);
      await createApp({ database: database as any });
      await request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({
          status: 'ok',
          info: { ...databaseOk },
          error: {},
          details: { ...databaseOk },
        });
    });

    it('should return the metric and status not ok when down', async () => {
      await createApp({ database: database as any });
      const error = {
        database: {
          status: 'down',
          message: 'Connection provider not found in application context',
        },
      };
      await request(app.getHttpServer())
        .get('/health')
        .expect(503)
        .expect({ status: 'error', info: {}, error, details: error });
    });
  });
});

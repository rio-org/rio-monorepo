import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { DatabaseService, LoggerService } from '@rio-app/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { THROTTLER_OPTIONS } from '@nestjs/throttler/dist/throttler.constants';
import { ThrottlerStorage } from '@nestjs/throttler';

describe('ApiController', () => {
  let appController: RewardsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [
        RewardsService,
        LoggerService,
        DatabaseService,
        { provide: THROTTLER_OPTIONS, useValue: jest.fn() },
        { provide: ThrottlerStorage, useValue: jest.fn() },
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue({ getPoolConnection: () => {} })
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .overrideProvider(THROTTLER_OPTIONS)
      .useValue({})
      .compile();

    appController = app.get<RewardsController>(RewardsController);
  });

  describe('root', () => {
    it('app should be a truthy value', () => {
      expect(appController).toBeTruthy();
    });
  });
});

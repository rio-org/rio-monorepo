import { Test, TestingModule } from '@nestjs/testing';
import { DappController } from './dapp.controller';
import { DappService } from './dapp.service';
import { DatabaseService, LoggerService } from '@rio-app/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { THROTTLER_OPTIONS } from '@nestjs/throttler/dist/throttler.constants';
import { ThrottlerStorage } from '@nestjs/throttler';

describe('ApiController', () => {
  let appController: DappController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DappController],
      providers: [
        DappService,
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

    appController = app.get<DappController>(DappController);
  });

  describe('root', () => {
    it('app should be a truthy value', () => {
      expect(appController).toBeTruthy();
    });
  });
});

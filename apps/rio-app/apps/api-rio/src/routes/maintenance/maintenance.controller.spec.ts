import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { DatabaseService, LoggerService } from '@rio-app/common';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheModule,
} from '@nestjs/cache-manager';
import { THROTTLER_OPTIONS } from '@nestjs/throttler/dist/throttler.constants';
import { ThrottlerBehindProxyGuard } from '../../guards';
import { ThrottlerStorage } from '@nestjs/throttler';

describe('MaintenanceController', () => {
  let appController: MaintenanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      imports: [CacheModule],
      providers: [
        MaintenanceService,
        LoggerService,
        DatabaseService,
        ThrottlerBehindProxyGuard,
        { provide: THROTTLER_OPTIONS, useValue: jest.fn() },
        { provide: ThrottlerStorage, useValue: jest.fn() },
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue({ getApiPoolConnection: () => {} })
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .overrideProvider(CACHE_MANAGER)
      .useValue({})
      .compile();

    appController = app.get<MaintenanceController>(MaintenanceController);
  });

  describe('root', () => {
    it('should return a truthy value', () => {
      expect(appController.getTime()).toBeTruthy();
    });
  });
});

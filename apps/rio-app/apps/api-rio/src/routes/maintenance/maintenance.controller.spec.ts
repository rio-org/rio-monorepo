import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { DatabaseService, LoggerService } from '@rio-app/common';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheModule,
} from '@nestjs/cache-manager';

describe('MaintenanceController', () => {
  let appController: MaintenanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      imports: [CacheModule],
      providers: [MaintenanceService, LoggerService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue({ getPoolConnection: () => {} })
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

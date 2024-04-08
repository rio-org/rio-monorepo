import { Module } from '@nestjs/common';
import { ApiRioController } from './api-rio.controller';
import { ApiRioService } from './api-rio.service';
import { RewardsModule, MaintenanceModule } from './routes/';
import {
  ApiRioConfigModule,
  ApiRioConfigService,
  DatabaseModule,
  DatabaseService,
  HealthModule,
  LoggerModule,
  LoggerService,
} from '@rio-app/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    ApiRioConfigModule,
    HealthModule.forRootAsync({
      useFactory: ({ database, redis }) => {
        return {
          database,
          redis,
        };
      },
      inject: [ApiRioConfigService],
    }),
    LoggerModule.forRootAsync({
      useFactory: ({ logger }: ApiRioConfigService) => logger,
      inject: [ApiRioConfigService],
      exports: [LoggerService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: ({ redis, throttlers }: ApiRioConfigService) => ({
        throttlers,
        storage: new ThrottlerStorageRedisService(redis.url),
      }),
      inject: [ApiRioConfigService],
    }),
    DatabaseModule.forRootAsync({
      useFactory: ({ database }: ApiRioConfigService) => ({
        database,
      }),
      inject: [ApiRioConfigService],
      exports: [DatabaseService],
    }),
    MaintenanceModule,
    RewardsModule,
  ],
  controllers: [ApiRioController],
  providers: [ApiRioService],
  exports: [ApiRioService],
})
export class ApiRioModule {}

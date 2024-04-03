import { Module } from '@nestjs/common';
import { ApiRioController } from './api-rio.controller';
import { ApiRioService } from './api-rio.service';
import { RewardsModule } from './rewards';
import { ApiRioConfigModule, ApiRioConfigService } from '@rio-app/config';
import { LoggerModule, LoggerService, HealthModule } from '@rio-app/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/common/cache';
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
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ApiRioConfigModule],
      useFactory: async ({ redis, redisCache }: ApiRioConfigService) => ({
        ttl: redisCache.ttl,
        store: (await redisStore({
          url: redis.url,
        })) as unknown as CacheStore,
      }),
      inject: [ApiRioConfigService],
    }),

    RewardsModule,
    HealthModule,
  ],
  controllers: [ApiRioController],
  providers: [ApiRioService],
  exports: [ApiRioService],
})
export class ApiRioModule {}

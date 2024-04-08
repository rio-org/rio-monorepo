import { Module } from '@nestjs/common';
import { CacheStore } from '@nestjs/common/cache';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ApiRioConfigModule, ApiRioConfigService } from '@rio-app/common';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

@Module({
  controllers: [MaintenanceController],
  imports: [
    CacheModule.registerAsync({
      imports: [ApiRioConfigModule],
      useFactory: async ({ redis, redisCache }: ApiRioConfigService) => ({
        ttl: redisCache.ttl,
        store: (await redisStore({
          url: redis.url,
          store: 'none',
        })) as unknown as CacheStore,
      }),
      inject: [ApiRioConfigService],
    }),
  ],
  providers: [
    MaintenanceService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class MaintenanceModule {}

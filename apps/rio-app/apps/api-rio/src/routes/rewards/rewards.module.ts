import { Module } from '@nestjs/common';
import { CacheStore } from '@nestjs/common/cache';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { ApiRioConfigModule, ApiRioConfigService } from '@rio-app/common';

@Module({
  controllers: [RewardsController],
  imports: [
    CacheModule.registerAsync({
      imports: [ApiRioConfigModule],
      useFactory: async ({ redis, redisCache }: ApiRioConfigService) => ({
        ttl: redisCache.ttl,
        store: (await redisStore({
          url: redis.url,
        })) as unknown as CacheStore,
      }),
      inject: [ApiRioConfigService],
    }),
  ],
  providers: [RewardsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class RewardsModule {}

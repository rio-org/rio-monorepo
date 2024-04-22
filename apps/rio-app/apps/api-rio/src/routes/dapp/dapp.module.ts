import { Module } from '@nestjs/common';
import { CacheStore } from '@nestjs/common/cache';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { DappController } from './dapp.controller';
import { DappService } from './dapp.service';
import { ApiRioConfigModule, ApiRioConfigService } from '@rio-app/common';

@Module({
  controllers: [DappController],
  imports: [
    CacheModule.registerAsync({
      imports: [ApiRioConfigModule],
      useFactory: async ({ redis }: ApiRioConfigService) => ({
        store: (await redisStore({
          url: redis.url,
          store: undefined,
        })) as unknown as CacheStore,
      }),
      inject: [ApiRioConfigService],
    }),
  ],
  providers: [DappService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class DappModule {}

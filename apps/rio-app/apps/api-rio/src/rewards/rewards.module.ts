import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  controllers: [RewardsController],
  providers: [RewardsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class RewardsModule {}

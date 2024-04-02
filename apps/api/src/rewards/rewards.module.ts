import { Module } from '@nestjs/common';
import { RewardsController, RewardsService } from './';

@Module({
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}

import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('rewards')
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get('/time')
  @CacheTTL(5) // seconds
  @UseInterceptors(CacheInterceptor)
  getTime(): string {
    return this.rewardsService.getTime();
  }

  @Get('/protocol')
  @CacheTTL(1) // TODO increase this amount of cache time on prod
  @UseInterceptors(CacheInterceptor)
  getProtocolRewardRate(): string {
    return this.rewardsService.getProtocolRewardRate();
  }
}

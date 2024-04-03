import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
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

  @Get('/:token/protocol')
  @CacheTTL(1) // TODO increase this amount of cache time on prod
  @UseInterceptors(CacheInterceptor)
  getProtocolRewardRate(@Param('token') token: string): string {
    return this.rewardsService.getProtocolRewardRate(token);
  }
}

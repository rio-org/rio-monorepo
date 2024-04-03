import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('rewards')
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get('/')
  @CacheTTL(5) // seconds
  @UseInterceptors(CacheInterceptor)
  getHello(): string {
    const val = this.rewardsService.getHello();
    return val;
  }
}

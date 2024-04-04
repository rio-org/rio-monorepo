import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RewardsResponse } from '@rio-app/common/types/rewards.types';
import { RewardsService } from './rewards.service';
import {
  AddressRewardRateDto,
  ProtocolRewardRateDto,
} from '../../dtos/rewards';

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
  getProtocolRewardRate(
    @Param() params: ProtocolRewardRateDto,
  ): Promise<RewardsResponse> {
    const { token } = params;
    return this.rewardsService.getProtocolRewardRate(token);
  }

  @Get('/:token/address/:address')
  @CacheTTL(1) // TODO increase this amount of cache time on prod
  @UseInterceptors(CacheInterceptor)
  getAddressRewardRate(
    @Param() params: AddressRewardRateDto,
  ): Promise<RewardsResponse> {
    const { token, address } = params;
    return this.rewardsService.getAddressRewardRate(token, address);
  }
}

import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RewardsResponse } from '@rio-app/common';
import { RewardsService } from './rewards.service';
import { AddressRewardRateDto, ProtocolRewardRateDto } from '../../dtos';
import { ThrottlerBehindProxyGuard } from '../../guards';

@Controller('rewards')
@UseGuards(ThrottlerBehindProxyGuard)
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get('/:token/chain/:chain/protocol')
  @CacheTTL(10)
  @UseInterceptors(CacheInterceptor)
  getProtocolRewardRate(
    @Param() params: ProtocolRewardRateDto,
  ): Promise<RewardsResponse> {
    const { token, chain } = params;
    return this.rewardsService.getProtocolRewardRate(token, chain);
  }

  @Get('/:token/chain/:chain/address/:address')
  @CacheTTL(10)
  @UseInterceptors(CacheInterceptor)
  getAddressRewardRate(
    @Param() params: AddressRewardRateDto,
  ): Promise<RewardsResponse> {
    const { token, address, chain } = params;
    return this.rewardsService.getAddressRewardRate(token, address, chain);
  }
}

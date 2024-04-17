import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DappService } from './dapp.service';
import { ThrottlerBehindProxyGuard } from '../../guards';
import { DappDepositDto } from '../../dtos/';
import { RealIp } from 'nestjs-real-ip';

@Controller('dapp')
@UseGuards(ThrottlerBehindProxyGuard)
export class DappController {
  constructor(private dappService: DappService) {}

  @Get('/:token/:chain/deposit/:txHash')
  async getProtocolRewardRate(
    @Param() params: DappDepositDto,
    @RealIp() realIp: string,
  ): Promise<void> {
    const { token, chain, txHash } = params;

    // TODO add protections around known token and known chains

    await this.dappService.saveDepositTxHash(token, chain, txHash, realIp);
  }
}

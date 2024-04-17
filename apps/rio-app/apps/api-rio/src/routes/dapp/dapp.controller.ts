import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RealIp } from 'nestjs-real-ip';
import { ThrottlerBehindProxyGuard } from '../../guards';
import { DappDepositDto } from '../../dtos/';
import { DappService } from './dapp.service';

@Controller('dapp')
@UseGuards(ThrottlerBehindProxyGuard)
export class DappController {
  constructor(private dappService: DappService) {}

  @Get('/:token/:chainId/deposit/:txHash')
  async getProtocolRewardRate(
    @Param() params: DappDepositDto,
    @RealIp() realIp: string,
  ): Promise<void> {
    let { token } = params;
    const { chainId, txHash } = params;

    // TODO replace this with a database check
    token = token.toLowerCase();
    if (token !== 'reeth') {
      throw new HttpException(
        `Unsupported token: ${token}`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      // hard code the value and capitalization
      token = 'reETH';
    }

    await this.dappService.saveDepositTxHash(token, chainId, txHash, realIp);
  }
}

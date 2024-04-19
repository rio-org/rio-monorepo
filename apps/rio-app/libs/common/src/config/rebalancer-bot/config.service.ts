import { Injectable } from '@nestjs/common';
import { SharedConfigService } from '../shared';
import { RebalancerBotServiceConfig } from './config.types';
import { RebalancerBots } from '../../';
import { FormatService } from '../../utils';
import { ConfigService } from '@nestjs/config';

/**
 * Convenience service used to access rebalancer-bot service configuration values
 */
@Injectable()
export class RebalancerBotConfigService extends SharedConfigService<RebalancerBotServiceConfig> {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly formatService: FormatService,
  ) {
    super(configService, formatService);
  }

  /**
   * List of available bots
   */
  public get bots(): RebalancerBots[] | undefined {
    return this.configService.get<RebalancerBots[]>(this._accessor.bots());
  }
}

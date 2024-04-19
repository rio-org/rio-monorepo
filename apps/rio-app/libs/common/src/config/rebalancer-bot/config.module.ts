import { Global, Module } from '@nestjs/common';
import configuration from './rebalancer-bot.config';
import { RebalancerBotConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedConfigModule } from '../shared';

/**
 * Import and provide configuration related classes
 */
@Global()
@Module({
  imports: [
    SharedConfigModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['rebalancer-bot.env'],
    }),
  ],
  providers: [ConfigService, RebalancerBotConfigService],
  exports: [ConfigService, RebalancerBotConfigService],
})
export class RebalancerBotConfigModule {}

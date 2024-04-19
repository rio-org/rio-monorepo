import { DynamicModule, Module } from '@nestjs/common';
import {
  HealthModule,
  LoggerModule,
  RebalancerBotConfigModule,
  RebalancerBotConfigService,
  RebalancerBotModuleOptions,
  UtilsModule,
} from '@rio-app/common';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import { TokenRebalancerModule } from './token-rebalancer';

@Module({
  imports: [RebalancerBotConfigModule],
})
export class RebalancerBotModule {
  /**
   * Register the module dynamically
   * @param moduleOptions The rebalancer bot module options
   */
  public static async registerAsync(
    moduleOptions: RebalancerBotModuleOptions,
  ): Promise<DynamicModule> {
    return {
      module: RebalancerBotModule,
      imports: [
        UtilsModule,
        HealthModule.forRootAsync({
          useFactory: ({ database, redis }) => {
            return {
              database,
              redis,
            };
          },
          inject: [RebalancerBotConfigService],
        }),
        LoggerModule.forRootAsync({
          useFactory: ({ logger }: RebalancerBotConfigService) => logger,
          inject: [RebalancerBotConfigService],
        }),
        DatadogTraceModule.forRoot(),
        TokenRebalancerModule.registerAsync(moduleOptions),
      ],
    };
  }
}

import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  LoggerService,
  RebalancerBotConfig,
  RebalancerBotConfigModule,
  RebalancerBotModuleOptions,
  UtilsModule,
} from '@rio-app/common';
import { SubgraphClient } from '@rionetwork/sdk';
import { TokenRebalancerService } from './token-rebalancer.service';

@Module({
  imports: [RebalancerBotConfigModule],
})
export class TokenRebalancerModule {
  /**
   * Register the module dynamically
   * @param moduleOptions The cron task module options
   */
  public static async registerAsync(
    moduleOptions: RebalancerBotModuleOptions,
  ): Promise<DynamicModule> {
    const { bots } = moduleOptions;
    const botProviders: Array<Provider> = [];

    for (const {
      chainId,
      rpcUrl,
      privateKey,
      guardianStubPrivateKey,
      isEnabled,
    } of bots) {
      if (!isEnabled) {
        console.log(`Rebalancer bot not enabled for chain id: ${chainId}`);
        break;
      }

      try {
        // Pull all available tokens on the current chain
        const subgraph = new SubgraphClient(chainId);
        const tokens = await subgraph.getLiquidRestakingTokens();

        // Start supported processes for each token.
        for (const token of tokens) {
          const botName = `${TokenRebalancerService.name}-${chainId}-${token.symbol}`;
          const config: RebalancerBotConfig = {
            chainId,
            rpcUrl,
            privateKey,
            guardianStubPrivateKey,
            token,
          };
          botProviders.push({
            provide: botName,

            inject: [LoggerService],
            useFactory: (logger: LoggerService) => {
              return new TokenRebalancerService(logger, config, botName);
            },
          } as Provider);
        }
      } catch (e) {
        throw new Error(
          `Error trying to create rebalancer bots for chainId:${chainId} ${e.message}`,
        );
      }
    }

    return {
      module: TokenRebalancerModule,
      imports: [UtilsModule],
      providers: [...botProviders],
    };
  }
}

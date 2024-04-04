import { Provider } from '@nestjs/common';
import { CHAIN_ID, UtilsProvider } from '@rio-app/common';
import { TaskSchedulerConfigService } from '@rio-app/common';
// import { holesky } from 'viem/chains';
// import { createPublicClient } from 'viem';
// import { http as viemHttp } from 'viem/_types/clients/transports/http';
import { SubgraphClient } from '@rionetwork/sdk';

export class TaskSchedulerProviders {
  /**
   * Creates the provider for the Loki Driver
   */
  // public static createSubgraphClientProvider(): Provider {
  //   return {
  //     provide: TaskSchedulerProvider.SUBGRAPH_CLIENT_PROVIDER,
  //     useFactory: ({ tasks }: TaskSchedulerConfigService) => {
  //       // return new SubgraphClient(this.chainId, {
  //         subgraphUrl: SUBGRAPH_URL,
  //         subgraphApiKey: SUBGRAPH_API_KEY,
  //       });
  //     },
  //     inject: [TaskSchedulerConfigService],
  //   };
  // }

  public static createSubgraphConnection(): Provider {
    return {
      provide: UtilsProvider.SUBGRAPH_CONNECTION,
      useFactory: ({ getSubgraphDatasource }: TaskSchedulerConfigService) => {
        console.log(getSubgraphDatasource);
        const subgraph = getSubgraphDatasource(CHAIN_ID.HOLESKY);

        return new SubgraphClient(subgraph.chainId, {
          subgraphUrl: subgraph.url,
          subgraphApiKey: subgraph.apiKey,
        });
      },
      inject: [TaskSchedulerConfigService],
    };
  }
}

import { Provider } from '@nestjs/common';
import { CHAIN_ID, UtilsProvider } from '@rio-app/common';
import { TaskSyncDBConfigService } from '@rio-app/common';
import { SubgraphClient } from '@rionetwork/sdk';

export class TaskSyncDbProviders {
  public static createSubgraphConnection(): Provider {
    return {
      provide: UtilsProvider.SUBGRAPH_CONNECTION,
      useFactory: ({ getSubgraphDatasource }: TaskSyncDBConfigService) => {
        const subgraph = getSubgraphDatasource(CHAIN_ID.HOLESKY);

        return new SubgraphClient(subgraph.chainId, {
          subgraphUrl: subgraph.url,
          subgraphApiKey: subgraph.apiKey,
        });
      },
      inject: [TaskSyncDBConfigService],
    };
  }
}

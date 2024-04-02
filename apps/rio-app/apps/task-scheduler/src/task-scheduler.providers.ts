import { Provider } from '@nestjs/common';
import { UtilsProvider } from '@rio-app/common';
import { TaskSchedulerConfigService } from '@rio-app/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { schema } from '@internal/db';

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

  public static createDatabaseConnection(): Provider {
    return {
      provide: UtilsProvider.DATABASE_CONNECTION,
      useFactory: ({ database }: TaskSchedulerConfigService) => {
        const { username, password, host, port, databaseName } = database;
        const client = postgres(
          `postgres://${username}:${password}@${host}:${port}/${databaseName}`,
        );
        const db = drizzle(client, { schema });
        return { client, db };
      },
      inject: [TaskSchedulerConfigService],
    };
  }
}

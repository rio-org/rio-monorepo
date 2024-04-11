import { Inject, Injectable } from '@nestjs/common';
import {
  Deposit,
  LiquidRestakingToken,
  SubgraphClient,
  TokenTransfer,
  WithdrawalRequest,
} from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { desc, apiSchema } from '@internal/db';
import {
  Deposit_OrderBy,
  OrderDirection,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import {
  CHAIN_ID,
  ChainService,
  SecurityDaemonCronTask,
  DatabaseService,
  LoggerService,
  SecurityDaemonConfigService,
  SecurityDaemonProvider,
} from '@rio-app/common';

@Injectable()
export class ProcessRemovalQueueTaskManagerService {
  private readonly db: ReturnType<
    typeof this.databaseService.getSecurityConnection
  >['db'];

  constructor(
    @Inject(SecurityDaemonProvider.CRON_TASK)
    private task: SecurityDaemonCronTask,
    private logger: LoggerService,
    private chain: ChainService,
    private config: SecurityDaemonConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.db = this.databaseService.getSecurityConnection().db;
  }

  @Cron(CronExpression.EVERY_HOUR)
  /**
   * Sync the transfers from the chains and tokens
   */
  async processRemovalQueue() {
    if (this.task?.chainIds.length === 0) {
      throw new Error(`No chain ids defined for ${this.task.task}`);
    }
    for (const chainId of this.task.chainIds) {
      const subgraphDatasource = this.config.getSubgraphDatasource(chainId);
      const subgraph = new SubgraphClient(subgraphDatasource.chainId, {
        subgraphUrl: subgraphDatasource.url,
        subgraphApiKey: subgraphDatasource.apiKey,
      });

      const liquidRestakingTokens = await subgraph.getLiquidRestakingTokens();

      try {
        this.logger.log(
          `[ProcessQueue::${chainId}::Starting] Processing removal queue`,
        );

        // Do things to each item in
        liquidRestakingTokens;
        //
        this.logger.log(
          `[ProcessQueue::${chainId}::Finished] Processing removal queue`,
        );
      } catch (error) {
        this.logger.error(
          `[ProcessQueue::${chainId}::Error] ${(error as Error).toString()}`,
        );
      }
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { SubgraphClient } from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
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

  @Cron(CronExpression.EVERY_MINUTE)
  /**
   * Process and emit validator key removal transactions in the
   * removal queue
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
        this.logger.log(`[Starting::${chainId}] Processing removal queue`);

        // Do things to each item in
        liquidRestakingTokens;
        //
        this.logger.log(`[Finished::${chainId}] Processing removal queue`);
      } catch (error) {
        this.logger.error(`[Error::${chainId}] ${(error as Error).toString()}`);
      }
    }
  }
}

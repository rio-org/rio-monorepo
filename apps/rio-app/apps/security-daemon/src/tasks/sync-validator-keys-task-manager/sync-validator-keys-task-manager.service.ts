import { Inject, Injectable } from '@nestjs/common';
import { SubgraphClient } from '@rionetwork/sdk';
import { Cron } from '@nestjs/schedule';
import {
  DatabaseService,
  LoggerService,
  SecurityDaemonConfigService,
  SecurityDaemonProvider,
  SecurityDaemonCronTask,
  ChainService,
} from '@rio-app/common';

@Injectable()
export class SyncValidatorKeysTaskManagerService {
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

  @Cron('0 0-23/1 * * *')
  /**
   * Retrieves all added validator keys for the past hour and
   * adds ejection requests to the queue for any invalid keys
   */
  async syncValidatorKeys() {
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
        this.logger.log(`[Starting::${chainId}] Syncing added keys...`);
        //
        // Do things to each item in
        liquidRestakingTokens;
        //
        this.logger.log(`[Complete::${chainId}] Finished syncing.`);
      } catch (error) {
        this.logger.error(`[Error::${chainId}] ${(error as Error).toString()}`);
      }
    }
  }
}

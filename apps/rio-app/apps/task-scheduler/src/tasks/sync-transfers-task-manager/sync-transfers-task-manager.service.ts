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
  CronTask,
  DatabaseService,
  LoggerService,
  TaskSchedulerConfigService,
  TaskSchedulerProvider,
} from '@rio-app/common';
import { SyncTransfersUtils } from './sync-transfers.utils';

@Injectable()
export class SyncTransfersTaskManagerService {
  private readonly db: ReturnType<
    typeof this.databaseService.getConnection
  >['db'];
  private readonly client: ReturnType<
    typeof this.databaseService.getConnection
  >['client'];

  constructor(
    @Inject(TaskSchedulerProvider.CRON_TASK)
    private task: CronTask,
    private logger: LoggerService,
    private chain: ChainService,
    private config: TaskSchedulerConfigService,
    private syncTransferUtils: SyncTransfersUtils,
    private readonly databaseService: DatabaseService,
  ) {
    this.logger.setContext(this.constructor.name);

    const { db, client } = this.databaseService.getConnection();
    this.db = db;
    this.client = client;
  }

  @Cron(CronExpression.EVERY_HOUR)
  /**
   * Sync the transfers from the chains and tokens
   */
  async syncTransfers() {
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
        this.logger.log(`[Transfers::Starting] Updating transfers`);
        await this.updateTransfers(liquidRestakingTokens, chainId, subgraph);
      } catch (error) {
        this.logger.error(`[Transfers::Error] ${(error as Error).toString()}`);
      }
    }
  }

  /**
   * Update token transfers
   * @param liquidRestakingTokens The LRTs
   * @param chainId The Chain id
   * @param subgraph The subgraph client
   */
  private async updateTransfers(
    liquidRestakingTokens: LiquidRestakingToken[],
    chainId: CHAIN_ID,
    subgraph: SubgraphClient,
  ) {
    const { currentBlockNumber, batchSize, ...batchInfo } =
      await this.getBatchInfo(chainId, subgraph);

    if (!batchSize) return;
    let { blockNumber } = batchInfo;

    while (blockNumber < currentBlockNumber) {
      const transfers: (typeof apiSchema.transfer.$inferInsert)[] = [];
      this.logger.log(
        `[Transfers::Fetching Blocks] ${blockNumber}->${
          blockNumber + batchSize
        }`,
      );

      for await (const liquidRestakingToken of liquidRestakingTokens) {
        const _batchTransfers = await this.getTransferBatch(
          batchSize,
          blockNumber,
          liquidRestakingToken,
          chainId,
          subgraph,
        );
        transfers.push(..._batchTransfers);
        this.logger.log(
          `[Transfers::${liquidRestakingToken.symbol}] Inserting ${transfers.length} transfers`,
        );
      }

      if (transfers.length) {
        await this.db.insert(apiSchema.transfer).values(transfers).returning();
      }

      blockNumber += batchSize;
    }
  }

  /**
   * Retrieves transfer data from the latest batch
   * @param chainId The chain id
   * @param subgraph The subgraph client
   */
  private async getBatchInfo(chainId: CHAIN_ID, subgraph: SubgraphClient) {
    const currentBlockNumberPromise = this.chain
      .chainClient(chainId)
      .getBlockNumber();
    const latestTransferPromise = this.db.query.transfer.findFirst({
      orderBy: [desc(apiSchema.transfer.blockNumber)],
    });

    let { blockNumber } = (await latestTransferPromise) ?? { blockNumber: 0 };
    const currentBlockNumber = await currentBlockNumberPromise;
    const blockDifference = Number(currentBlockNumber) - blockNumber;

    if (!blockNumber) {
      const firstDeposits = await subgraph.getDeposits({
        perPage: 1,
        orderBy: Deposit_OrderBy.BlockNumber,
        orderDirection: OrderDirection.Asc,
      });
      if (!firstDeposits.length) {
        this.logger.log('[Transfers::Done] No deposits found. Exiting...');
        return { blockNumber, batchSize: 0, currentBlockNumber };
      }
      blockNumber = +firstDeposits[0].blockNumber - 1;
    }

    const batchSize = Math.min(
      blockDifference,
      blockDifference > 3000 ? 5000 : 1000,
    );

    return { blockNumber, batchSize, currentBlockNumber };
  }

  /**
   * Create batch of transfer objects
   * @param batchSize The batch size
   * @param blockNumber The block number
   * @param liquidRestakingToken The liquid restaking token
   * @param chainId The chain id
   * @param subgraph The subgraph client
   */
  private async getTransferBatch(
    batchSize: number,
    blockNumber: number,
    liquidRestakingToken: LiquidRestakingToken,
    chainId: CHAIN_ID,
    subgraph: SubgraphClient,
  ) {
    const transfers: (typeof apiSchema.transfer.$inferInsert)[] = [];

    const symbol = liquidRestakingToken.symbol;
    let depositsPage = 1;
    let withdrawalsPage = 1;
    let transfersPage = 1;
    let depositsFinished = false;
    let withdrawalsFinished = false;
    let transfersFinished = false;

    while (!depositsFinished || !withdrawalsFinished || !transfersFinished) {
      const configs = this.syncTransferUtils.buildBatchQueryConfigs(
        blockNumber,
        batchSize,
      );

      const [deposits, withdrawals, tokenTransfers]: [
        Deposit[],
        WithdrawalRequest[],
        TokenTransfer[],
      ] = await Promise.all([
        depositsFinished
          ? Promise.resolve([])
          : subgraph.getDeposits({
              ...configs.deposits,
              page: depositsPage++,
            }),
        withdrawalsFinished
          ? Promise.resolve([])
          : subgraph.getWithdrawalRequests({
              ...configs.withdrawals,
              page: withdrawalsPage++,
            }),
        transfersFinished
          ? Promise.resolve([])
          : subgraph.getTokenTransfers({
              ...configs.transfers,
              page: transfersPage++,
            }),
      ]);

      this.logger.log(
        `[Transfers::${liquidRestakingToken.symbol}] ` +
          `Deposits: ${deposits.length}, Withdrawals: ${withdrawals.length}, TokenTransfers : ${tokenTransfers.length}`,
      );

      transfers.push(
        ...deposits.map((d) =>
          this.syncTransferUtils.parseDeposit(chainId, symbol, d),
        ),
        ...withdrawals.map((d) =>
          this.syncTransferUtils.parseWithdrawal(chainId, symbol, d),
        ),
        ...tokenTransfers.map((t) =>
          this.syncTransferUtils.parseTokenTransfer(chainId, symbol, t),
        ),
      );

      depositsFinished ||= deposits.length < configs.deposits.perPage;
      withdrawalsFinished ||= withdrawals.length < configs.withdrawals.perPage;
      transfersFinished ||= tokenTransfers.length < configs.transfers.perPage;

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return transfers;
  }
}

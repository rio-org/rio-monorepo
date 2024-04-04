import { holesky } from 'viem/chains';
import { Injectable } from '@nestjs/common';
import {
  Chain,
  createPublicClient,
  parseEther,
  http as viemHttp,
  zeroAddress,
} from 'viem';
import {
  Deposit,
  LiquidRestakingToken,
  SubgraphClient,
  TokenTransfer,
  WithdrawalRequest,
} from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { desc, schema } from '@internal/db';
import {
  Deposit_OrderBy,
  OrderDirection,
  TokenTransfer_OrderBy,
  WithdrawalRequest_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import {
  CHAIN_ID,
  DatabaseService,
  LoggerService,
  TaskSchedulerConfigService,
} from '@rio-app/common';

@Injectable()
export class SyncTransfersTaskManagerService {
  private readonly subgraph: SubgraphClient;
  private readonly chain: Chain;
  private readonly rpcUrl: string;
  private readonly publicClient;
  private readonly chainId: CHAIN_ID;
  private readonly db: ReturnType<
    typeof this.databaseService.getConnection
  >['db'];
  private readonly client: ReturnType<
    typeof this.databaseService.getConnection
  >['client'];

  constructor(
    private logger: LoggerService,
    private configService: TaskSchedulerConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.logger.setContext(this.constructor.name);

    const { db, client } = this.databaseService.getConnection();
    this.db = db;
    this.client = client;

    this.chainId = CHAIN_ID.HOLESKY;
    const subgraph = this.configService.getSubgraphDatasource(CHAIN_ID.HOLESKY);

    this.chain = holesky;
    this.rpcUrl = this.chain.rpcUrls.default.http[0];
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: viemHttp(this.rpcUrl),
    });
    this.subgraph = new SubgraphClient(subgraph.chainId, {
      subgraphUrl: subgraph.url,
      subgraphApiKey: subgraph.apiKey,
    });
  }

  static parseDeposit(chainId: number, symbol: string, deposit: Deposit) {
    return {
      chainId,
      blockNumber: +deposit.blockNumber,
      txHash: deposit.tx,
      from: zeroAddress,
      to: deposit.sender,
      value: parseEther(deposit.amountOut).toString(),
      asset: symbol,
      timestamp: new Date(+deposit.timestamp * 1000),
    };
  }

  static parseWithdrawal(
    chainId: number,
    symbol: string,
    withdrawal: WithdrawalRequest,
  ) {
    return {
      chainId,
      blockNumber: +withdrawal.blockNumber,
      txHash: withdrawal.tx,
      from: withdrawal.sender,
      to: zeroAddress,
      value: parseEther(withdrawal.amountIn).toString(),
      asset: symbol,
      timestamp: new Date(+withdrawal.timestamp * 1000),
    };
  }

  static parseTokenTransfer(
    chainId: number,
    symbol: string,
    transfer: TokenTransfer,
  ) {
    return {
      chainId,
      blockNumber: +transfer.blockNumber,
      txHash: transfer.tx,
      from: transfer.sender,
      to: transfer.receiver,
      value: parseEther(transfer.amount).toString(),
      asset: symbol,
      timestamp: new Date(+transfer.timestamp * 1000),
    };
  }

  static buildBatchQueryConfigs(blockNumber: number, batchSize: number) {
    const common = {
      where: {
        blockNumber_gt: blockNumber,
        blockNumber_lte: blockNumber + batchSize,
      },
      perPage: 100,
      orderDirection: OrderDirection.Asc,
    };
    return {
      deposits: {
        ...common,
        orderBy: Deposit_OrderBy.BlockNumber,
      },
      withdrawals: {
        ...common,
        orderBy: WithdrawalRequest_OrderBy.BlockNumber,
      },
      transfers: {
        ...common,
        orderBy: TokenTransfer_OrderBy.BlockNumber,
      },
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncTransfers() {
    const liquidRestakingTokens =
      await this.subgraph.getLiquidRestakingTokens();

    try {
      this.logger.log(`[Transfers::Starting] Updating transfers`);
      await this.updateTransfers(liquidRestakingTokens);
    } catch (error) {
      this.logger.error(`[Transfers::Error] ${(error as Error).toString()}`);
    }
  }

  private async updateTransfers(liquidRestakingTokens: LiquidRestakingToken[]) {
    const { currentBlockNumber, batchSize, ...batchInfo } =
      await this.getBatchInfo();

    if (!batchSize) return;

    let { blockNumber } = batchInfo;

    while (blockNumber < currentBlockNumber) {
      const transfers: (typeof schema.transfer.$inferInsert)[] = [];
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
        );
        transfers.push(..._batchTransfers);
        this.logger.log(
          `[Transfers::${liquidRestakingToken.symbol}] Inserting ${transfers.length} transfers`,
        );
      }

      if (transfers.length) {
        await this.db.insert(schema.transfer).values(transfers).returning();
      }

      blockNumber += batchSize;
    }
  }

  private async getBatchInfo() {
    const currentBlockNumberPromise = this.publicClient.getBlockNumber();
    const latestTransferPromise = this.db.query.transfer.findFirst({
      orderBy: [desc(schema.transfer.blockNumber)],
    });

    let { blockNumber } = (await latestTransferPromise) ?? { blockNumber: 0 };
    const currentBlockNumber = await currentBlockNumberPromise;
    const blockDifference = Number(currentBlockNumber) - blockNumber;

    if (!blockNumber) {
      const firstDeposits = await this.subgraph.getDeposits({
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
   * @param batchSize
   * @param blockNumber
   * @param liquidRestakingToken
   * @private
   */
  private async getTransferBatch(
    batchSize: number,
    blockNumber: number,
    liquidRestakingToken: LiquidRestakingToken,
  ) {
    const transfers: (typeof schema.transfer.$inferInsert)[] = [];

    const symbol = liquidRestakingToken.symbol;
    const chainId = this.chainId;
    let depositsPage = 1;
    let withdrawalsPage = 1;
    let transfersPage = 1;
    let depositsFinished = false;
    let withdrawalsFinished = false;
    let transfersFinished = false;

    while (!depositsFinished || !withdrawalsFinished || !transfersFinished) {
      const configs = SyncTransfersTaskManagerService.buildBatchQueryConfigs(
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
          : this.subgraph.getDeposits({
              ...configs.deposits,
              page: depositsPage++,
            }),
        withdrawalsFinished
          ? Promise.resolve([])
          : this.subgraph.getWithdrawalRequests({
              ...configs.withdrawals,
              page: withdrawalsPage++,
            }),
        transfersFinished
          ? Promise.resolve([])
          : this.subgraph.getTokenTransfers({
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
          SyncTransfersTaskManagerService.parseDeposit(chainId, symbol, d),
        ),
        ...withdrawals.map((d) =>
          SyncTransfersTaskManagerService.parseWithdrawal(chainId, symbol, d),
        ),
        ...tokenTransfers.map((t) =>
          SyncTransfersTaskManagerService.parseTokenTransfer(
            chainId,
            symbol,
            t,
          ),
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

import {
  createPublicClient,
  http as viemHttp,
  zeroAddress,
  parseEther,
} from 'viem';
import { mainnet, goerli, holesky } from 'viem/chains';
import { Injectable, Logger } from '@nestjs/common';
import {
  Deposit,
  SubgraphClient,
  WithdrawalRequest,
  TokenTransfer,
  LiquidRestakingToken,
} from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getDrizzleClient, schema, desc } from '@internal/db';
import {
  Deposit_OrderBy,
  OrderDirection,
  WithdrawalRequest_OrderBy,
  TokenTransfer_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';

const {
  RPC_URL,
  CHAIN_ID,
  SUBGRAPH_URL,
  SUBGRAPH_API_KEY,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name, {
    timestamp: true,
  });

  private readonly dbConfig = {
    host: DB_HOST || 'localhost',
    port: parseInt(`${DB_PORT || 5432}`),
    user: DB_USER || 'postgres',
    password: DB_PASSWORD || 'postgres',
    database: DB_NAME || 'rio-restaking',
  };

  private readonly subgraph: SubgraphClient;
  private readonly chainId = parseInt(CHAIN_ID ?? `17000`);
  private readonly chain =
    this.chainId === mainnet.id
      ? mainnet
      : this.chainId === goerli.id
      ? goerli
      : holesky;
  private readonly rpcUrl = RPC_URL ?? this.chain.rpcUrls.default.http[0];
  private readonly publicClient = createPublicClient({
    chain: this.chain,
    transport: viemHttp(this.rpcUrl),
  });

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

  constructor() {
    if (!SUBGRAPH_URL || !SUBGRAPH_API_KEY) {
      throw new Error('Missing SUBGRAPH_URL or SUBGRAPH_API_KEY');
    }
    this.subgraph = new SubgraphClient(this.chainId, {
      subgraphUrl: SUBGRAPH_URL,
      subgraphApiKey: SUBGRAPH_API_KEY,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async sync() {
    const { db, client } = this.getConnection();
    const liquidRestakingTokens =
      await this.subgraph.getLiquidRestakingTokens();

    try {
      await Promise.all([
        this.updateExchangeRates(db, liquidRestakingTokens),
        this.updateTransfers(db, liquidRestakingTokens),
      ]);
    } catch (error) {
      this.logger.error(
        `[TaskScheduler::Sync Error] ${(error as Error).toString()}`,
      );
    } finally {
      await client.end();
    }
  }

  private getConnection() {
    const { user, password, host, port, database } = this.dbConfig;
    return getDrizzleClient({
      connectionString: `postgres://${user}:${password}@${host}:${port}/${database}`,
    });
  }

  private async updateExchangeRates(
    db: ReturnType<typeof this.getConnection>['db'],
    liquidRestakingTokens: LiquidRestakingToken[],
  ) {
    for await (const liquidRestakingToken of liquidRestakingTokens) {
      liquidRestakingToken.totalSupply;
    }
  }

  private async updateTransfers(
    db: ReturnType<typeof this.getConnection>['db'],
    liquidRestakingTokens: LiquidRestakingToken[],
  ) {
    const { currentBlockNumber, batchSize, ...batchInfo } =
      await this.getBatchInfo(db);

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
        await db.insert(schema.transfer).values(transfers).returning();
      }

      blockNumber += batchSize;
    }
  }

  private async getBatchInfo(db: ReturnType<typeof getDrizzleClient>['db']) {
    const currentBlockNumberPromise = this.publicClient.getBlockNumber();
    const latestTransferPromise = db.query.transfer.findFirst({
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
      const configs = TaskSchedulerService.buildBatchQueryConfigs(
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
          TaskSchedulerService.parseDeposit(chainId, symbol, d),
        ),
        ...withdrawals.map((d) =>
          TaskSchedulerService.parseWithdrawal(chainId, symbol, d),
        ),
        ...tokenTransfers.map((t) =>
          TaskSchedulerService.parseTokenTransfer(chainId, symbol, t),
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

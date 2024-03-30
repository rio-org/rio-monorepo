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
import { desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '@internal/db';
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
      timestamp: new Date(+transfer.timestamp),
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
  async updateTransfers() {
    const { client, db } = this.getConnection();
    try {
      this.logger.log('Fetching transfer events...');

      const liquidRestakingTokensPromise =
        this.subgraph.getLiquidRestakingTokens();

      const { currentBlockNumber, batchSize, ...batchInfo } =
        await this.getBatchInfo(db);
      if (!batchSize) return;

      let { blockNumber } = batchInfo;
      const liquidRestakingTokens = await liquidRestakingTokensPromise;

      while (blockNumber < currentBlockNumber) {
        const transfers: (typeof schema.transfer.$inferInsert)[] = [];
        this.logger.log(
          `  [Processing Blocks] ${blockNumber}->${blockNumber + batchSize}`,
        );

        for await (const liquidRestakingToken of liquidRestakingTokens) {
          const _batchTransfers = await this.getTransferBatch(
            batchSize,
            blockNumber,
            liquidRestakingToken,
          );
          transfers.push(..._batchTransfers);
          this.logger.log(
            `  [${liquidRestakingToken.symbol}] Inserting ${transfers.length} transfers`,
          );
        }

        if (transfers.length) {
          await db.insert(schema.transfer).values(transfers).returning();
        }

        blockNumber += batchSize;
      }

      this.logger.log('Finished fetching transfer events');

      client.end();
    } catch (error) {
      this.logger.log('error', (error as Error).toString());
      client.end();
    }
  }

  private getConnection() {
    const { user, password, host, port, database } = this.dbConfig;
    const client = postgres(
      `postgres://${user}:${password}@${host}:${port}/${database}`,
    );
    return { client, db: drizzle(client, { schema }) };
  }

  private async getBatchInfo(db: ReturnType<typeof drizzle<typeof schema>>) {
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
        this.logger.log('No deposits found. Exiting...');
        return { blockNumber, batchSize: 0, currentBlockNumber };
      }
      blockNumber = +firstDeposits[0].blockNumber - 1;
    }
    this.logger.log(`Resuming at block: ${blockNumber}`);

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

    let depositsPage = 1;
    let withdrawalsPage = 1;
    let transfersPage = 1;
    let depositsFinished = false;
    let withdrawalsFinished = false;
    let transfersFinished = false;

    const config = {
      where: {
        blockNumber_gt: blockNumber,
        blockNumber_lte: blockNumber + batchSize,
        restakingToken: liquidRestakingToken.address,
      },
      perPage: 100,
      orderDirection: OrderDirection.Asc,
    };

    while (!depositsFinished || !withdrawalsFinished || !transfersFinished) {
      const depositsPromise: Promise<Deposit[]> = depositsFinished
        ? Promise.resolve([])
        : this.subgraph.getDeposits({
            ...config,
            page: depositsPage++,
            orderBy: Deposit_OrderBy.BlockNumber,
          });
      const withdrawalsPromise: Promise<WithdrawalRequest[]> =
        withdrawalsFinished
          ? Promise.resolve([])
          : this.subgraph.getWithdrawalRequests({
              ...config,
              page: withdrawalsPage++,
              orderBy: WithdrawalRequest_OrderBy.BlockNumber,
            });

      const tokenTransfersPromise: Promise<TokenTransfer[]> = transfersFinished
        ? Promise.resolve([])
        : this.subgraph.getTokenTransfers({
            ...config,
            page: transfersPage++,
            orderBy: TokenTransfer_OrderBy.BlockNumber,
          });

      const symbol = liquidRestakingToken.symbol;
      const chainId = this.chainId;

      const deposits = await depositsPromise;
      const withdrawals = await withdrawalsPromise;
      const tokenTransfers = await tokenTransfersPromise;

      this.logger.log(
        [
          `  [${liquidRestakingToken.symbol}] Fetched batch!`,
          !deposits.length || `    Deposits       : ${deposits.length}`,
          !withdrawals.length || `    Withdrawals    : ${withdrawals.length}`,
          !tokenTransfers.length ||
            `    TokenTransfers : ${tokenTransfers.length}`,
        ]
          .filter(Boolean)
          .join('\n'),
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

      depositsFinished = !depositsFinished ? deposits.length < 100 : true;
      withdrawalsFinished = !withdrawalsFinished
        ? withdrawals.length < 100
        : true;
      transfersFinished = !transfersFinished
        ? tokenTransfers.length < 100
        : true;

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return transfers;
  }
}

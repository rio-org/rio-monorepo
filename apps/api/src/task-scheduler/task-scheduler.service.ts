import {
  createPublicClient,
  http as viemHttp,
  zeroAddress,
  parseEther,
} from 'viem';
import { mainnet, goerli, holesky } from 'viem/chains';
import { Injectable, Logger } from '@nestjs/common';
import { Deposit, SubgraphClient, WithdrawalRequest } from '@rionetwork/sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '@internal/db';
import {
  Deposit_OrderBy,
  OrderDirection,
  WithdrawalRequest_OrderBy,
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

  constructor() {
    if (!SUBGRAPH_URL || !SUBGRAPH_API_KEY) {
      throw new Error('Missing SUBGRAPH_URL or SUBGRAPH_API_KEY');
    }
    this.subgraph = new SubgraphClient(this.chainId, {
      subgraphUrl: SUBGRAPH_URL,
      subgraphApiKey: SUBGRAPH_API_KEY,
    });
  }

  private getConnection() {
    const { user, password, host, port, database } = this.dbConfig;
    const client = postgres(
      `postgres://${user}:${password}@${host}:${port}/${database}`,
    );
    return { client, db: drizzle(client, { schema }) };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateTransfers() {
    try {
      this.logger.log('Fetching transfer events...');

      const { client, db } = this.getConnection();

      const liquidRestakingTokensPromise =
        this.subgraph.getLiquidRestakingTokens();
      const currentBlockNumberPromise = this.publicClient.getBlockNumber();
      const latestTransferPromise = db.query.transfer.findFirst({
        orderBy: [desc(schema.transfer.blockNumber)],
      });

      let { blockNumber } = (await latestTransferPromise) ?? { blockNumber: 0 };
      const currentBlockNumber = await currentBlockNumberPromise;
      const liquidRestakingTokens = await liquidRestakingTokensPromise;
      const blockDifference = Number(currentBlockNumber) - blockNumber;

      if (blockNumber === 0) {
        const firstDeposits = await this.subgraph.getDeposits({
          perPage: 1,
          orderBy: Deposit_OrderBy.BlockNumber,
          orderDirection: OrderDirection.Asc,
        });
        if (!firstDeposits.length) {
          this.logger.log('No deposits found. Exiting...');
          return;
        }
        blockNumber = +firstDeposits[0].blockNumber - 1;
      }

      const batchSize = Math.min(
        blockDifference,
        blockDifference > 3000 ? 5000 : 1000,
      );

      while (blockNumber < currentBlockNumber) {
        const transfers: (typeof schema.transfer.$inferInsert)[] = [];
        this.logger.log(
          `  [Processing Blocks] ${blockNumber}->${blockNumber + batchSize}`,
        );

        for await (const liquidRestakingToken of liquidRestakingTokens) {
          let depositsPage = 1;
          let withdrawalsPage = 1;
          let depositsFinished = false;
          let withdrawalsFinished = false;

          const where = {
            blockNumber_gt: blockNumber,
            blockNumber_lte: blockNumber + batchSize,
            restakingToken: liquidRestakingToken.address,
          };

          while (!depositsFinished || !withdrawalsFinished) {
            const depositsPromise: Promise<Deposit[]> = depositsFinished
              ? Promise.resolve([])
              : this.subgraph.getDeposits({
                  where,
                  page: depositsPage++,
                  perPage: 50,
                  orderBy: Deposit_OrderBy.BlockNumber,
                  orderDirection: OrderDirection.Asc,
                });
            const withdrawalsPromise: Promise<WithdrawalRequest[]> =
              withdrawalsFinished
                ? Promise.resolve([])
                : this.subgraph.getWithdrawalRequests({
                    where,
                    page: withdrawalsPage++,
                    perPage: 50,
                    orderBy: WithdrawalRequest_OrderBy.BlockNumber,
                    orderDirection: OrderDirection.Asc,
                  });
            const deposits = await depositsPromise;
            const withdrawals = await withdrawalsPromise;

            this.logger.log(
              `  [${liquidRestakingToken.symbol}] Deposits: ${deposits.length}, Withdrawals: ${withdrawals.length}`,
            );

            transfers.push(
              ...deposits.map((d) => ({
                chainId: this.chainId,
                blockNumber: +d.blockNumber,
                txHash: d.tx,
                from: zeroAddress,
                to: d.sender,
                value: parseEther(d.amountOut).toString(),
                asset: liquidRestakingToken.symbol,
                timestamp: new Date(+d.timestamp * 1000),
              })),
              ...withdrawals.map((d) => ({
                chainId: this.chainId,
                blockNumber: +d.blockNumber,
                txHash: d.tx,
                from: d.sender,
                to: zeroAddress,
                value: parseEther(d.amountIn).toString(),
                asset: liquidRestakingToken.symbol,
                timestamp: new Date(+d.timestamp * 1000),
              })),
            );

            depositsFinished = !depositsFinished ? deposits.length < 50 : true;
            withdrawalsFinished = !withdrawalsFinished
              ? withdrawals.length < 50
              : true;

            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

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
      this.logger.log('error');
      this.logger.log(error);
    }
  }
}

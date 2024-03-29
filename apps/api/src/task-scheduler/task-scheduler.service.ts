import { createPublicClient, http, zeroAddress, parseEther } from 'viem';
import { mainnet, goerli, holesky } from 'viem/chains';
import { Injectable, Logger } from '@nestjs/common';
import { SubgraphClient } from '@rionetwork/sdk';
import { Cron } from '@nestjs/schedule';

import { DatabaseService } from '@/libs/common/database/database.service';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name, {
    timestamp: true,
  });

  private readonly rpcUrl = process.env.RPC_URL;

  private readonly chainId = parseInt(process.env.CHAIN_ID ?? '17000');

  private readonly chain =
    this.chainId === 1 ? mainnet : this.chainId === 5 ? goerli : holesky;

  private readonly publicClient = createPublicClient({
    chain: this.chain,
    transport: http(this.rpcUrl),
  });

  private readonly subgraph = new SubgraphClient(this.chainId, {
    subgraphUrl: process.env.SUBGRAPH_URL,
    subgraphApiKey: process.env.SUBGRAPH_API_KEY,
  });

  constructor(private readonly databaseService: DatabaseService) {}

  @Cron('0 * * * *')
  async updateTransfers() {
    this.logger.log('Fetching transfer events');
    const { client, db } = this._getConnection();
    const { DESC } = this.databaseService.getOrderOperators();
    const schema = this.databaseService.getSchema();

    const liquidRestakingTokensPromise =
      this.subgraph.getLiquidRestakingTokens();
    const currentBlockNumberPromise = this.publicClient.getBlockNumber();
    const latestTransferPromise = db.query.transfer.findFirst({
      orderBy: [DESC(schema.transfer.blockNumber)],
    });

    let { blockNumber } = (await latestTransferPromise) ?? { blockNumber: 0 };
    const currentBlockNumber = await currentBlockNumberPromise;
    const liquidRestakingTokens = await liquidRestakingTokensPromise;
    const blockDifference = Number(currentBlockNumber) - blockNumber;
    const batchSize = Math.min(
      blockDifference,
      blockDifference > 500 ? 1000 : 100,
    );

    while (blockNumber < currentBlockNumber) {
      const transfers: (typeof schema.transfer.$inferInsert)[] = [];
      this.logger.log(
        `- [Processing Blocks] ${blockNumber}->${blockNumber + batchSize}`,
      );

      for await (const liquidRestakingToken of liquidRestakingTokens) {
        const where = {
          blockNumber_gt: blockNumber,
          blockNumber_lte: blockNumber + batchSize,
          restakingToken: liquidRestakingToken.address,
        };
        const depositsPromise = this.subgraph.getDeposits({ where });
        const withdrawalsPromise = this.subgraph.getWithdrawalRequests({
          where,
        });
        const deposits = await depositsPromise;
        const withdrawals = await withdrawalsPromise;

        this.logger.log(
          `  - [${liquidRestakingToken.symbol}] Deposits: ${deposits.length}, Withdrawals: ${withdrawals.length}`,
        );

        transfers.push(
          ...deposits.map((d) => ({
            chainId: this.chainId,
            blockNumber: +d.blockNumber,
            txHash: d.tx,
            from: zeroAddress,
            to: d.sender,
            amount: parseEther(d.amountOut),
            asset: liquidRestakingToken.symbol,
            timestamp: new Date(+d.timestamp * 1000),
          })),
          ...withdrawals.map((d) => ({
            chainId: this.chainId,
            blockNumber: +d.blockNumber,
            txHash: d.tx,
            from: d.sender,
            to: zeroAddress,
            amount: parseEther(d.amountIn),
            asset: liquidRestakingToken.symbol,
            timestamp: new Date(+d.timestamp * 1000),
          })),
        );

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      await db.transaction(async (tx) => {
        for (let i = 0; i < transfers.length; i += batchSize) {
          const chunk = transfers.slice(i, i + batchSize);
          tx.insert(schema.transfer).values(chunk).returning();
        }
      });

      blockNumber += batchSize;
    }

    this.logger.log('Finished fetching transfer events');

    client.end();
  }

  private _getConnection() {
    return this.databaseService.getConnection();
  }
}

import bigDecimal from 'js-big-decimal';
import { holesky } from 'viem/chains';
import { Inject, Injectable } from '@nestjs/common';
import {
  Chain,
  createPublicClient,
  http as viemHttp,
  parseEther,
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
import { desc, schema, sql } from '@internal/db';
import {
  Deposit_OrderBy,
  OrderDirection,
  TokenTransfer_OrderBy,
  WithdrawalRequest_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import { CHAIN_ID, LoggerService, UtilsProvider } from '@rio-app/common';
import { TaskSchedulerConfigService } from '@rio-app/config';

@Injectable()
export class ImportDataTaskManagerService {
  private readonly subgraph: SubgraphClient;
  private readonly chain: Chain;
  private readonly rpcUrl: string;
  private readonly publicClient;
  private readonly chainId: CHAIN_ID;

  constructor(
    private logger: LoggerService,
    private configService: TaskSchedulerConfigService,
    @Inject(UtilsProvider.DATABASE_CONNECTION)
    private readonly _db,
  ) {
    this.logger.setContext(this.constructor.name);

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

  @Cron('5 0-23/1 * * *')
  async syncExchangeRates() {
    const { db, client } = this._db;
    const liquidRestakingTokens =
      await this.subgraph.getLiquidRestakingTokens();

    try {
      this.logger.log(`[Rates::Starting] Updating exchange rates`);
      await this.updateExchangeRates(db, liquidRestakingTokens);
    } catch (error) {
      this.logger.error(`[Rates::Error] ${(error as Error).toString()}`);
    } finally {
      await client.end();
    }
  }

  //@Cron(CronExpression.EVERY_HOUR)
  @Cron(CronExpression.EVERY_MINUTE)
  async syncTransfers() {
    const { db, client } = this._db;
    const liquidRestakingTokens =
      await this.subgraph.getLiquidRestakingTokens();

    try {
      this.logger.log(`[Transfers::Starting] Updating transfers`);
      await this.updateTransfers(db, liquidRestakingTokens);
    } catch (error) {
      this.logger.error(`[Transfers::Error] ${(error as Error).toString()}`);
    } finally {
      await client.end();
    }
  }

  private async updateExchangeRates(
    db: ReturnType<typeof this._db.db>,
    liquidRestakingTokens: LiquidRestakingToken[],
  ) {
    const currentBlockNumberPromise = this.publicClient.getBlockNumber();
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const oneHourAgo = currentTimestamp - 3600;

    for await (const liquidRestakingToken of liquidRestakingTokens) {
      // Calculate current values for timestamp and block number
      this.logger.log(
        `[Rates::${liquidRestakingToken.symbol}] Retrieving most recent entry...`,
      );

      // Get the last balance sheet entry
      const lastEntry = await db.query.balanceSheet.findFirst({
        // eslint-disable-next-line
        // @ts-ignore
        where: (balances, { eq }) =>
          // eslint-disable-next-line
          // @ts-ignore
          eq(balances.restakingToken, liquidRestakingToken.symbol),
        orderBy: [desc(schema.balanceSheet.timestamp)],
      });

      // If there is no last entry, insert a dummy entry for 1 wei at the beginning of time
      if (!lastEntry) {
        this.logger.log(
          `[Rates::${liquidRestakingToken.symbol}] No previous entry. Inserting 1:1 value as seed`,
        );
        await db.insert(schema.balanceSheet).values({
          chainId: this.chainId,
          asset: 'ETH',
          asset_balance: '1',
          restakingToken: liquidRestakingToken.symbol,
          restakingToken_supply: '1',
          blockNumber: 0,
          timestamp: new Date(0),
        });
      } else {
        let lastTimestamp = Math.floor(lastEntry.timestamp.valueOf() / 1000);

        // Insert balance sheet entries for each hour between the last entry and one hour ago
        // We don't do this if the only entry is the seed entry at the beginning of time
        while (lastTimestamp && lastTimestamp <= oneHourAgo) {
          const _timestamp = new Date(lastTimestamp * 1000);
          const _timestampStr = _timestamp.toISOString();
          this.logger.log(
            `[Rates::${liquidRestakingToken.symbol}] Calculating historic rate for ${_timestampStr}...`,
          );

          // Get the total supply of the restaking token by counting all deposits and withdrawals
          // up to this timestamp
          const restakingTokenBalanceArrPromise: { supply: number }[] =
            await db.execute(sql`
              WITH deposited AS (
                SELECT 1 AS idx,
                       SUM(${schema.transfer.value})/1e18 AS value
                  FROM ${schema.transfer}
                 WHERE ${schema.transfer.from} = '0x0000000000000000000000000000000000000000'
                   AND ${schema.transfer.timestamp} <= ${_timestampStr}
              ), withdrawn AS (
                SELECT 1 AS idx,
                       SUM(${schema.transfer.value})/1e18 AS value
                  FROM ${schema.transfer}
                 WHERE ${schema.transfer.to} = '0x0000000000000000000000000000000000000000'
                   AND ${schema.transfer.timestamp} <= ${_timestampStr}
              )

              SELECT deposited.value - withdrawn.value AS supply
                FROM withdrawn
                JOIN deposited ON deposited.idx=withdrawn.idx;
            `);

          // Get the closest deposit to the last timestamp.
          // We can't rely on the database here because it doesn't hold ETH transfers
          const closestDeposits = await this.subgraph.getDeposits({
            perPage: 1,
            where: {
              timestamp_lte: lastTimestamp,
              restakingToken: liquidRestakingToken.address,
            },
            orderBy: Deposit_OrderBy.Timestamp,
            orderDirection: OrderDirection.Desc,
          });

          // If there are no deposits, we can't do anything for this entry,
          // so continue to the next hour
          const closestDeposit = closestDeposits[0];
          if (!closestDeposit) {
            this.logger.log(
              `[Rates::${liquidRestakingToken.symbol}] No deposits found for ${_timestampStr}. Skipping.`,
            );
            lastTimestamp += 3600;
            continue;
          }

          // Get the required values and format them for use
          const amountIn = new bigDecimal(closestDeposit.amountIn);
          const amountOut = new bigDecimal(closestDeposit.amountOut);
          const exchangeRate = amountIn.divide(amountOut, 18);

          // Get the most recent token supply.
          const restakingTokenSupply = (
            await restakingTokenBalanceArrPromise
          )[0]?.supply;
          const liquidRestakingTokenBalance = restakingTokenSupply
            ? new bigDecimal(restakingTokenSupply)
            : amountOut;

          this.logger.log(
            `[Rates::${liquidRestakingToken.symbol}] Inserting exchange rate for ${_timestampStr}...`,
          );
          // Insert the new balance sheet entry
          await db.insert(schema.balanceSheet).values({
            chainId: this.chainId,
            asset: 'ETH',
            asset_balance: parseEther(
              liquidRestakingTokenBalance.divide(exchangeRate, 18).getValue(),
            ).toString(),
            restakingToken: liquidRestakingToken.symbol,
            restakingToken_supply: parseEther(
              liquidRestakingTokenBalance.getValue(),
            ).toString(),
            blockNumber: +closestDeposit.blockNumber,
            timestamp: new Date(+closestDeposit.timestamp * 1000),
          });

          // Increment the last timestamp by an hour
          lastTimestamp += 3600;

          // Wait for 2 seconds to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      this.logger.log(
        `[Rates::${
          liquidRestakingToken.symbol
        }] Inserting current rate for ${new Date(
          currentTimestamp * 1000,
        ).toISOString()}...`,
      );

      // Insert the current balance sheet entry
      await db.insert(schema.balanceSheet).values({
        chainId: this.chainId,
        asset: 'ETH',
        asset_balance: parseEther(
          liquidRestakingToken.totalValueETH || '1',
        ).toString(),
        restakingToken: liquidRestakingToken.symbol,
        restakingToken_supply: parseEther(
          liquidRestakingToken.totalSupply || '1',
        ).toString(),
        blockNumber: Number(await currentBlockNumberPromise),
        timestamp: new Date(currentTimestamp * 1000),
      });
    }
  }

  private async updateTransfers(
    db: ReturnType<typeof this._db.db>,
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

  private async getBatchInfo(db: ReturnType<typeof this._db.db>) {
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
      const configs = ImportDataTaskManagerService.buildBatchQueryConfigs(
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
          ImportDataTaskManagerService.parseDeposit(chainId, symbol, d),
        ),
        ...withdrawals.map((d) =>
          ImportDataTaskManagerService.parseWithdrawal(chainId, symbol, d),
        ),
        ...tokenTransfers.map((t) =>
          ImportDataTaskManagerService.parseTokenTransfer(chainId, symbol, t),
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

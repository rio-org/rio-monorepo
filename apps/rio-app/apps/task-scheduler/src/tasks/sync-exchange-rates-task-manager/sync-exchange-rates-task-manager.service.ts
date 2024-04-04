import BigDecimal from 'js-big-decimal';
import { holesky } from 'viem/chains';
import { Injectable } from '@nestjs/common';
import {
  Address,
  Chain,
  createPublicClient,
  parseEther,
  http as viemHttp,
} from 'viem';
import {
  ERC20ABI,
  LiquidRestakingToken,
  SubgraphClient,
} from '@rionetwork/sdk';
import { Cron } from '@nestjs/schedule';
import { desc, schema, sql } from '@internal/db';
import {
  Deposit_OrderBy,
  OrderDirection,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';
import {
  CHAIN_ID,
  DatabaseService,
  LoggerService,
  TaskSchedulerConfigService,
  RioLRTAssetRegistryABI,
} from '@rio-app/common';

@Injectable()
export class SyncExchangeRatesTaskManagerService {
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

  @Cron('48 0-23/1 * * *')
  async syncExchangeRates() {
    const liquidRestakingTokens =
      await this.subgraph.getLiquidRestakingTokens();

    try {
      this.logger.log(`[Rates::Starting] Updating exchange rates`);
      await this.updateExchangeRates(liquidRestakingTokens);
    } catch (error) {
      this.logger.error(`[Rates::Error] ${(error as Error).toString()}`);
    }
  }

  /**
   * Updates exchange rates
   * @param liquidRestakingTokens
   * @private
   */
  private async updateExchangeRates(
    liquidRestakingTokens: LiquidRestakingToken[],
  ) {
    const currentBlockNumberPromise = this.publicClient.getBlockNumber();
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const oneHourAgo = currentTimestamp - 3600;

    for await (const liquidRestakingToken of liquidRestakingTokens) {
      const protocolValues = Promise.all([
        this.publicClient.readContract({
          address: liquidRestakingToken.deployment.assetRegistry as Address,
          abi: RioLRTAssetRegistryABI,
          functionName: 'getTVL',
        }),
        this.publicClient.readContract({
          address: liquidRestakingToken.address as Address,
          abi: ERC20ABI,
          functionName: 'totalSupply',
        }),
      ]);

      // Calculate current values for timestamp and block number
      this.logger.log(
        `[Rates::${liquidRestakingToken.symbol}] Retrieving most recent entry...`,
      );

      // Get the last balance sheet entry
      let lastEntry = await this.db.query.balanceSheet.findFirst({
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
        lastEntry = (
          await this.db
            .insert(schema.balanceSheet)
            .values({
              chainId: this.chainId,
              asset: 'ETH',
              asset_balance: '1',
              restakingToken: liquidRestakingToken.symbol,
              restakingToken_supply: '1',
              exchangeRate: '1',
              ratePerSecond: '0',
              blockNumber: 0,
              timestamp: new Date(
                +liquidRestakingToken.createdTimestamp * 1000,
              ),
            })
            .returning()
        )[0];
      }

      // add 60 minutes to lastTimestamp and then round down to the nearest 5 minute past the hour
      let lastTimestamp = Math.floor(
        new Date(
          new Date(lastEntry.timestamp.valueOf() + 60 ** 2 * 1e3)
            .toISOString()
            .replace(/\d{2}:\d{2}\.\d{3}/, '05:00.000'),
        ).valueOf() / 1000,
      );

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
        const restakingTokenBalanceArrPromise: { supply: number }[] = await this
          .db.execute(sql`
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
            amountIn_gt: '0.0000000001',
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
          await new Promise((resolve) => setTimeout(resolve, 900));
          continue;
        }

        // Get the required values and format them for use
        const amountIn = new BigDecimal(closestDeposit.amountIn);
        const amountOut = new BigDecimal(closestDeposit.amountOut);
        const exchangeRate = amountIn.divide(amountOut, 18);

        // Get the most recent token supply.
        const restakingTokenSupply = new BigDecimal(
          (await restakingTokenBalanceArrPromise)[0]?.supply ||
            amountOut.getValue(),
        );

        this.logger.log(
          `[Rates::${liquidRestakingToken.symbol}] Inserting exchange rate for ${_timestampStr}...`,
        );

        const assetBalance = restakingTokenSupply
          .multiply(exchangeRate)
          .divide(new BigDecimal('1'), 18);

        lastEntry = await this.insertBalance({
          restakingTokenSupply,
          chainId: this.chainId,
          symbol: liquidRestakingToken.symbol,
          assetBalance,
          blockNumber: closestDeposit.blockNumber,
          blocktime: lastTimestamp,
          lastExchangeRate: new BigDecimal(lastEntry.exchangeRate!),
          lastTimestamp: lastEntry.timestamp,
        });

        // Increment the last timestamp by an hour
        lastTimestamp += 3600;

        // Wait for 2 seconds to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      this.logger.log(
        `[Rates::${
          liquidRestakingToken.symbol
        }] Inserting current rate for ${new Date(
          currentTimestamp * 1000,
        ).toISOString()}...`,
      );

      const [tvl, lrtSupply] = await protocolValues;

      const assetBalance = new BigDecimal(
        tvl || parseEther(liquidRestakingToken.totalValueETH || '1'),
      );
      const restakingTokenSupply = new BigDecimal(
        lrtSupply || parseEther(liquidRestakingToken.totalSupply || '1'),
      );

      await this.insertBalance({
        restakingTokenSupply,
        assetBalance,
        chainId: this.chainId,
        symbol: liquidRestakingToken.symbol,
        blockNumber: Number(await currentBlockNumberPromise),
        blocktime: currentTimestamp,
        lastExchangeRate: new BigDecimal(lastEntry.exchangeRate!),
        lastTimestamp: lastEntry.timestamp,
      });
    }
  }

  /**
   * Inserts a given balance into the Balance Sheet
   * @param chainId
   * @param restakingTokenSupply
   * @param assetBalance
   * @param symbol
   * @param blocktime
   * @param blockNumber
   * @param lastExchangeRate
   * @param lastTimestamp
   * @private
   */
  private async insertBalance({
    chainId,
    restakingTokenSupply,
    assetBalance,
    symbol,
    blocktime,
    blockNumber,
    lastExchangeRate,
    lastTimestamp,
  }: {
    chainId: number;
    restakingTokenSupply: BigDecimal;
    assetBalance: BigDecimal;
    symbol: string;
    blockNumber: number | string;
    blocktime: number | string;
    lastExchangeRate: BigDecimal;
    lastTimestamp: Date;
  }) {
    const exchangeRate = assetBalance.divide(restakingTokenSupply, 24);
    const deltaRate = exchangeRate.subtract(lastExchangeRate);

    const closestTimestamp = new Date(Number(blocktime) * 1000);
    const timestampDiff = Math.floor(
      (closestTimestamp.valueOf() - lastTimestamp.valueOf()) / 1000,
    );

    // Insert the new balance sheet entry
    return (
      await this.db
        .insert(schema.balanceSheet)
        .values({
          chainId,
          asset: 'ETH',
          asset_balance: parseEther(assetBalance.getValue()).toString(),
          restakingToken: symbol,
          restakingToken_supply: parseEther(
            restakingTokenSupply.getValue(),
          ).toString(),
          exchangeRate: exchangeRate.getValue(),
          ratePerSecond: deltaRate
            .divide(new BigDecimal(timestampDiff), 24)
            .getValue(),
          blockNumber: +Number(blockNumber),
          timestamp: closestTimestamp,
        })
        .returning()
    )[0];
  }
}

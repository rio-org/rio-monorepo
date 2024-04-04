import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getDrizzlePool, schema, sql } from '@internal/db';
import { zeroAddress } from 'viem';
import {
  DatabaseService,
  LoggerService,
  RewardsResponse,
  RewardsForAddressQueryResponse,
} from '@rio-app/common';

@Injectable()
export class RewardsService {
  private readonly drizzlePool: ReturnType<typeof getDrizzlePool>;
  constructor(
    private readonly _logger: LoggerService,
    private readonly _databaseService: DatabaseService,
  ) {
    this.drizzlePool = this._databaseService.getPoolConnection();
  }
  /**
   * Returns the current time in millis
   */
  getTime(): string {
    return Date.now().toString();
  }

  /**
   * Calculates the total protocol rewards for a given token
   * @param token The token to pull the reward rate for
   */
  async getProtocolRewardRate(token: string): Promise<RewardsResponse> {
    const { transfer, balanceSheet } = schema;
    const { db } = this.drizzlePool;

    const eligibleTokens = await db
      .selectDistinct({ asset: transfer.asset })
      .from(transfer)
      .then((r) => r.map((r) => r.asset));
    const _token = eligibleTokens.find(
      (t) => t.toLowerCase() === token.toLowerCase(),
    );

    if (!_token) {
      throw new HttpException(`Token not supported`, HttpStatus.NO_CONTENT);
    }

    try {
      const results = await db.execute<RewardsForAddressQueryResponse>(
        sql`
          WITH extrapolation AS (
            SELECT ROUND(
              (EXTRACT(EPOCH FROM INTERVAL '1 year') * 1000)
              / (EXTRACT(EPOCH FROM INTERVAL '14 days') * 1000)
            ) as extrapolation
          ),
          balance as (
            SELECT
              COALESCE(SUM(
                CASE WHEN ${transfer.to} = ${zeroAddress}
                  THEN - ${transfer.value}
                  ELSE ${transfer.value}
                END
              ), 0) as balance
            FROM ${transfer}
            WHERE
              ${transfer.chainId} = 17000
              AND ${transfer.asset} = ${_token}
              AND (${transfer.to} = ${zeroAddress} OR ${transfer.from} = ${zeroAddress})
          ),
          starting_rate as (
            SELECT
              COALESCE(MAX(${balanceSheet.exchangeRate}), 1) as starting_rate
            FROM
              ${balanceSheet}
            WHERE
              ${balanceSheet.timestamp} <= CURRENT_TIMESTAMP - INTERVAL '14 DAYS'
              AND ${balanceSheet.chainId} = 17000
              AND ${balanceSheet.restakingToken} = ${_token}
          ),
          final_rate as (
            SELECT
              COALESCE(MAX(${balanceSheet.exchangeRate}), 1) as final_rate
            FROM
              rio_restaking.balance_sheet
            WHERE ${balanceSheet.chainId} = 17000
              AND ${balanceSheet.restakingToken} = ${_token}
          )
        SELECT
          TRUNC(
            ((balance * final_rate) - (COALESCE(balance) * starting_rate)) / 1e18,
            18
          ) as eth_rewards_in_period,
          TRUNC(
            (final_rate - starting_rate) * extrapolation * 100,
            18
          ) as yearly_rewards_percent
        FROM
          balance
          JOIN extrapolation on 1=1
          JOIN final_rate on 1=1
          JOIN starting_rate on 1=1;
        `,
      );

      return {
        eth_rewards_in_period: results[0]?.eth_rewards_in_period || '0',
        yearly_rewards_percent: results[0]?.yearly_rewards_percent || '0',
      };
    } catch (e) {
      this._logger.error(`[Error] Token: ${token}`, e.toString());
      console.log('error', e.toString());
      throw new HttpException(
        `Internal Server Error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Calculates the rewards for a given token and address extrapolated from the last 14 days
   * @param token The token to pull the reward rate for
   * @param address The address to calculate the rewards for
   */
  async getAddressRewardRate(
    token: string,
    address: string,
  ): Promise<RewardsResponse> {
    const { transfer, balanceSheet } = schema;
    const { asset, to, from, value, chainId, timestamp } = schema.transfer;
    const { db } = this.drizzlePool;

    const eligibleTokens = await db
      .selectDistinct({ asset })
      .from(transfer)
      .then((r) => r.map((r) => r.asset));

    const _address = address.toLowerCase();
    const _token = eligibleTokens.find(
      (t) => t.toLowerCase() === token.toLowerCase(),
    );

    if (!_token) {
      throw new HttpException(`Token not supported`, HttpStatus.NO_CONTENT);
    }

    try {
      const results = await db.execute<RewardsForAddressQueryResponse>(
        sql`
          -- Filter the user's transfers and calculate their
          -- running LRT balance at the time of each transfer
          WITH transfers_with_balances AS (
            SELECT
              *,
              SUM(COALESCE(
                CASE WHEN ${to} = ${_address} THEN ${value} ELSE -${value} END, 0
              )) OVER (ORDER BY ${timestamp} ASC) - ${value} AS balance_before
            FROM ${transfer}
            WHERE ${chainId} = 17000
            AND (${to} = ${_address} OR ${from} = ${_address} AND ${to} != ${zeroAddress})
          ),
          -- ...
          user_transfers AS (
            SELECT * FROM transfers_with_balances
            WHERE timestamp >= current_timestamp - INTERVAL '14 days'
          ),
          -- i will comment this later
          derived_variables AS (
            SELECT
              ROW_NUMBER() OVER (ORDER BY timestamp ASC) AS row_num,
              t.timestamp,
              t.balance_before,
              bs.exchange_rate,
              (CASE WHEN  t.to = ${_address} THEN  t.value ELSE -t.value END) AS delta
            FROM transfers_with_balances t
            CROSS JOIN LATERAL (
              SELECT
                b.delta_rate_per_second AS rate_per_second,
                b.exchange_rate
              FROM ${balanceSheet} b
              WHERE b.chain_id = 17000 and b.timestamp <= t.timestamp
              ORDER BY b.timestamp DESC
              LIMIT 1
            ) bs
            ORDER BY t.timestamp ASC
          ),
          -- i will comment this later
          with_rates AS (
            SELECT dv.*,
              (CASE WHEN row_num = 1 THEN fr.val ELSE 0 END) AS final_rate,
              (CASE WHEN row_num = 1 THEN sr.val ELSE 0 END) AS start_rate,
              (CASE WHEN row_num = 1 THEN dv.balance_before ELSE 0 END) AS start_balance
            FROM derived_variables dv
            JOIN (SELECT exchange_rate AS val FROM ${balanceSheet} ORDER BY ${balanceSheet.timestamp} DESC LIMIT 1) fr on 1=1
            JOIN (SELECT exchange_rate AS val FROM ${balanceSheet} ORDER BY ${balanceSheet.timestamp} ASC  LIMIT 1) sr on 1=1
          ),
          -- i will comment this later
          sums AS (
            SELECT
            SUM(start_rate) AS starting_rate,
            SUM(final_rate) AS final_rate,
            SUM(start_balance) / 1e18 AS starting_token_balance,
            SUM(delta) / 1e18 as token_change,
            SUM(delta) * SUM(final_rate) / 1e18 AS token_change_eth_value,
            SUM(delta * exchange_rate) / 1e18 AS total_eth_paid_in_range,
            (SUM(delta) * SUM(final_rate)) / (SUM(delta * exchange_rate)) - 1 as change_eth_value_reward_ratio,
            ROUND((EXTRACT(EPOCH FROM INTERVAL '1 year') * 1000) / (EXTRACT(EPOCH FROM INTERVAL '14 days') * 1000)) as extrapolation
            FROM with_rates
          ),
          final AS (
          -- kill me
            SELECT
              *,
              starting_rate * starting_token_balance AS start_eth_value,
              starting_token_balance + token_change AS final_token_balance,
              final_rate * (starting_token_balance + token_change) AS final_eth_value,
              final_rate * starting_token_balance - starting_rate * starting_token_balance AS eth_rewards_on_starting_balance,
              token_change_eth_value - total_eth_paid_in_range AS eth_rewards_on_change,
              (CASE
              WHEN starting_token_balance != 0
              THEN (starting_token_balance * (final_rate / starting_rate) / starting_token_balance) - 1
              ELSE 0
              END) AS change_eth_value_starting_balance_ratio
            FROM sums
          )
          -- no
          SELECT
            TRUNC(COALESCE(eth_rewards_on_starting_balance + eth_rewards_on_change, 0), 18) as eth_rewards_in_period,
            TRUNC(COALESCE(extrapolation * (eth_rewards_on_starting_balance + eth_rewards_on_change), 0), 18) as yearly_eth_rewards,
            TRUNC(COALESCE(100 * extrapolation * (change_eth_value_starting_balance_ratio + change_eth_value_reward_ratio), 0), 18) as yearly_rewards_percent,
            TRUNC(COALESCE(starting_rate, 1), 18) as starting_rate,
            TRUNC(COALESCE(final_rate, 1), 18) as final_rate,
            TRUNC(COALESCE(starting_token_balance, 0), 18) as starting_token_balance,
            TRUNC(COALESCE(token_change, 0), 18) as token_change,
            TRUNC(COALESCE(token_change_eth_value, 0), 18) as token_change_eth_value,
            TRUNC(COALESCE(total_eth_paid_in_range, 0), 18) as total_eth_paid_in_range,
            TRUNC(COALESCE(change_eth_value_reward_ratio, 0), 18) as change_eth_value_reward_ratio
          FROM final;
        `,
      );

      return {
        eth_rewards_in_period: results[0]?.eth_rewards_in_period || '0',
        yearly_rewards_percent: results[0]?.yearly_rewards_percent || '0',
      };
    } catch (e) {
      this._logger.error(`[Error] Address: ${address}, Token: ${token}`, e);
      throw new HttpException(
        `Internal Server Error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

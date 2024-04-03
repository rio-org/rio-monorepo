import { getDrizzlePool, sql } from '@internal/db';
import { Injectable } from '@nestjs/common';
import { DatabaseConnection, DatabaseService } from '@rio-app/common';

@Injectable()
export class RewardsService {
  private readonly drizzlePool: ReturnType<typeof getDrizzlePool>;
  constructor(private readonly databaseService: DatabaseService) {
    this.drizzlePool = this.databaseService.getPoolConnection();
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
  async getProtocolRewardRate(token: string): Promise<string> {
    const { db } = this.drizzlePool;
    const results = await db.execute(sql`
      -- Filter the user's transfers and calculate their
-- running LRT balance at the time of each transfer
WITH transfers_with_balances AS (
  SELECT
    *,
    SUM(COALESCE(
      CASE WHEN  "to" = '0xdf15d086eb2154617c3cab9026ba1fdb3ce1e3b7' THEN  "value" ELSE -"value" END, 0
    )) OVER (ORDER BY "timestamp" ASC) - "value" AS balance_before
  FROM rio_restaking.transfer
  WHERE chain_id = 17000
  AND ("to" = '0xdf15d086eb2154617c3cab9026ba1fdb3ce1e3b7' OR "from" = '0xdf15d086eb2154617c3cab9026ba1fdb3ce1e3b7' AND "to" != '0x0000000000000000000000000000000000000000')
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
    (CASE WHEN  t.to = '0xdf15d086eb2154617c3cab9026ba1fdb3ce1e3b7' THEN  t.value ELSE -t.value END) AS delta
  FROM transfers_with_balances t
  CROSS JOIN LATERAL (
    SELECT
      b.delta_rate_per_second AS rate_per_second,
      b.exchange_rate
    FROM rio_restaking.balance_sheet b
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
  JOIN (SELECT exchange_rate AS val FROM rio_restaking.balance_sheet ORDER BY "timestamp" DESC LIMIT 1) fr on 1=1
  JOIN (SELECT exchange_rate AS val FROM rio_restaking.balance_sheet ORDER BY "timestamp" ASC LIMIT 1) sr on 1=1
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
  extrapolation * (eth_rewards_on_starting_balance + eth_rewards_on_change) as yearly_eth_rewards,
  100 * extrapolation * (change_eth_value_starting_balance_ratio + change_eth_value_reward_ratio) as rewards_apy_percent,
  *
FROM final;
    `);

    console.log(results);
    return `${token} lots`;
  }

  /**
   * Calculates the rewards for a given token and address
   * @param token The token to pull the reward rate for
   */
  getAddressRewardRate(token: string, address: string): string {
    return `${token} ${address} lots`;
  }
}

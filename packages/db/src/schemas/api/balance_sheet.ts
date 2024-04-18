import {
  uuid,
  timestamp,
  index,
  varchar,
  numeric,
  integer,
  decimal,
} from 'drizzle-orm/pg-core';

import { schema } from './api_schema';

export const balanceSheet = schema.table(
  'balance_sheet',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').notNull(),
    asset: varchar('asset', { length: 42 }).notNull(),
    restakingToken: varchar('restaking_token', { length: 42 }).notNull(),
    asset_balance: numeric('asset_balance', {
      precision: 78,
      scale: 0,
    }).default('0'),
    restakingToken_supply: numeric('restaking_token_supply', {
      precision: 78,
      scale: 0,
    }).default('0'),
    exchangeRate: decimal('exchange_rate'),
    ratePerSecond: decimal('delta_rate_per_second'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    blockNumber: integer('block_number').notNull(),
  },
  (table) => ({
    chainIdx: index('balance_sheet_network_idx').on(table.chainId),
    assetIdx: index('balance_sheet_asset_idx').on(table.asset),
    restakingTokenIdx: index('balance_sheet_restaking_token_idx').on(
      table.restakingToken,
    ),
    timestampIdx: index('balance_sheet_timestamp_idx').on(table.timestamp),
    blockNumberIdx: index('balance_sheet_block_number_idx').on(
      table.blockNumber,
    ),
  }),
);

export type BalanceSheet = typeof balanceSheet.$inferSelect;
export type BalanceSheetInsert = typeof balanceSheet.$inferInsert;

import {
  uuid,
  timestamp,
  index,
  char,
  varchar,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { ZERO_ADDRESS } from '../lib/constants';

export const transfer = schema.table(
  'transfer',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').notNull(),
    txHash: char('transaction_hash', { length: 66 }).notNull(),
    from: char('from', { length: 42 }).notNull().default(ZERO_ADDRESS),
    to: char('to', { length: 42 }).notNull().default(ZERO_ADDRESS),
    asset: varchar('asset', { length: 42 }).notNull(),
    value: numeric('value', { precision: 78, scale: 0 }).default('0'),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    blockNumber: integer('block_number').notNull(),
  },
  (table) => ({
    chainIdx: index('transfer_network_idx').on(table.chainId),
    txHashIdx: index('transfer_transaction_hash_idx').on(table.txHash),
    fromIdx: index('transfer_from_idx').on(table.from),
    toIdx: index('transfer_to_idx').on(table.to),
    assetIdx: index('transfer_asset_idx').on(table.asset),
    timestampIdx: index('transfer_timestamp_idx').on(table.timestamp),
    blockNumberIdx: index('transfer_block_number_idx').on(table.blockNumber),
  }),
);

export type Transfer = typeof transfer.$inferSelect;
export type TransferInsert = typeof transfer.$inferInsert;

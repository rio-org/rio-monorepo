import { uuid, numeric, index } from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { transaction } from './transaction';
import { account } from './account';
import { asset } from './asset';

export const transfer = schema.table(
  'transfer',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    transactionId: uuid('transaction_id')
      .references(() => transaction.id)
      .notNull(),
    fromId: uuid('from_id')
      .references(() => account.id)
      .notNull(),
    toId: uuid('to_id')
      .references(() => account.id)
      .notNull(),
    assetId: uuid('asset_id')
      .references(() => asset.id)
      .notNull(),
    amount: numeric('amount', { precision: 78, scale: 0 }).notNull(),
  },
  (table) => ({
    transactionIdx: index('transfer_transaction_idx').on(table.transactionId),
    fromIdx: index('transfer_from_idx').on(table.fromId),
    toIdx: index('transfer_to_idx').on(table.toId),
    assetId: index('transfer_asset_idx').on(table.assetId),
  }),
);

export type Transfer = typeof transfer.$inferSelect;
export type TransferInsert = typeof transfer.$inferInsert;

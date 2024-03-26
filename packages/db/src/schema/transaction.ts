import { uuid, timestamp, index, char } from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { network } from './network';
import { account } from './account';

export const transaction = schema.table(
  'transaction',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    networkId: uuid('network_id')
      .references(() => network.id)
      .notNull(),
    hash: char('hash', { length: 66 }).unique().notNull(),
    accountId: uuid('account_id')
      .references(() => account.id)
      .notNull(),
    timestamp: timestamp('timestamp').notNull(),
  },
  (table) => ({
    networkIdx: index('transaction_network_idx').on(table.networkId),
    hashIdx: index('transaction_hash_idx').on(table.hash),
    accountIdx: index('transaction_account_idx').on(table.accountId),
  }),
);

export type Transaction = typeof transaction.$inferSelect;
export type TransactionInsert = typeof transaction.$inferInsert;

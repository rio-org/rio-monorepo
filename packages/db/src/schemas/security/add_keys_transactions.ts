import { uuid, timestamp, index, char, integer } from 'drizzle-orm/pg-core';

import { schema } from './security_schema';

export const addKeysTransactions = schema.table(
  'add_keys_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').notNull(),
    operatorId: integer('operator_id').notNull(),
    operatorRegistryAddress: char('operator_registry_address', {
      length: 42,
    }).notNull(),
    txHash: char('transaction_hash', { length: 66 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    blockNumber: integer('block_number').notNull(),
  },
  (table) => ({
    chainIdx: index('add_keys_transactions_chain_idx').on(table.chainId),
    txHashIdx: index('add_keys_transactions_transaction_hash_idx').on(
      table.txHash,
    ),
    operatorIdx: index('add_keys_transactions_operator_idx').on(
      table.operatorId,
    ),
    operatorRegistryAddressIdx: index(
      'add_keys_transactions_operator_registry_idx',
    ).on(table.operatorId),
    timestampIdx: index('add_keys_transactions_timestamp_idx').on(
      table.timestamp,
    ),
    blockNumberIdx: index('add_keys_transactions_block_number_idx').on(
      table.blockNumber,
    ),
  }),
);

export type AddKeysTransaction = typeof addKeysTransactions.$inferSelect;
export type AddKeysTransactionInsert = typeof addKeysTransactions.$inferInsert;

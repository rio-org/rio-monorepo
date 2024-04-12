import { uuid, index, char, integer, pgEnum } from 'drizzle-orm/pg-core';

import { schema } from './security_schema';

export const transactionStatusEnum = pgEnum('transaction_status', [
  'queued',
  'pending',
  'reverted',
  'succeeded',
]);

export const removalReasonEnum = pgEnum('removal_reason', [
  'duplicate',
  'public_key_used',
  'invalid_signature',
]);

export const removeKeysTransactions = schema.table(
  'remove_keys_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').notNull(),
    operatorId: integer('operator_id').notNull(),
    operatorRegistryAddress: char('operator_registry_address', {
      length: 42,
    }).notNull(),
    txHash: char('transaction_hash', { length: 66 }),
    removalReason: removalReasonEnum('removal_reason').notNull(),
    status: transactionStatusEnum('status').default('queued'),
  },
  (table) => ({
    chainIdx: index('remove_keys_transactions_chain_idx').on(table.chainId),
    txHashIdx: index('remove_keys_transactions_transaction_hash_idx').on(
      table.txHash,
    ),
    operatorIdx: index('remove_keys_transactions_operator_idx').on(
      table.operatorId,
    ),
    operatorRegistryAddressIdx: index(
      'remove_keys_transactions_operator_registry_idx',
    ).on(table.operatorId),
    statusIdx: index('remove_keys_transactions_status_idx').on(table.status),
  }),
);

export type RemoveKeysTransaction = typeof removeKeysTransactions.$inferSelect;
export type RemoveKeysTransactionInsert =
  typeof removeKeysTransactions.$inferInsert;

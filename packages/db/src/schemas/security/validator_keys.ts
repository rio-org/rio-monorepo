import { uuid, index, char, integer } from 'drizzle-orm/pg-core';

import { schema } from './security_schema';
import { removeKeysTransactions } from './remove_keys_transactions';
import { addKeysTransactions } from './add_keys_transactions';

export const validatorKeys = schema.table(
  'validatorKeys',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').notNull(),
    operatorId: integer('operator_id').notNull(),
    operatorRegistryAddress: char('operator_registry_address', {
      length: 42,
    }).notNull(),
    publicKey: char('public_key', { length: 96 }).notNull(),
    signature: char('signature', { length: 192 }).notNull(),
    keyIndex: integer('key_index').notNull(),
    addKeysTransactionId: uuid('add_keys_transaction_id')
      .notNull()
      .references(() => addKeysTransactions.id),
    removeKeysTransactionId: uuid('remove_keys_transaction_id').references(
      () => removeKeysTransactions.id,
    ),
  },
  (table) => ({
    chainIdx: index('validator_keys_chain_idx').on(table.chainId),
    operatorIdx: index('validator_keys_operator_idx').on(table.operatorId),
    operatorRegistryAddressIdx: index(
      'validator_keys_operator_registry_idx',
    ).on(table.operatorId),
    publicKeyIdx: index('validator_keys_public_key_idx').on(table.publicKey),
    keyIndexIdx: index('validator_keys_key_index_idx').on(table.keyIndex),
    addKeysTransactionIdx: index('validator_keys_add_keys_transaction_idx').on(
      table.addKeysTransactionId,
    ),
    removeKeysTransactionIdx: index(
      'validator_keys_remove_keys_transaction_idx',
    ).on(table.removeKeysTransactionId),
  }),
);

export type ValidatorKey = typeof validatorKeys.$inferSelect;
export type ValidatorKeyInsert = typeof validatorKeys.$inferInsert;

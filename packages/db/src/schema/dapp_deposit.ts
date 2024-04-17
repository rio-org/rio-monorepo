import {
  uuid,
  timestamp,
  index,
  varchar,
  integer,
  char,
} from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { unique } from 'drizzle-orm/pg-core/unique-constraint';

export const dappDeposit = schema.table(
  'dapp_deposit',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').notNull(),
    restakingToken: varchar('restaking_token', { length: 42 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true })
      .defaultNow()
      .notNull(),
    ip: varchar('ip'),
    txHash: char('transaction_hash', { length: 66 }).notNull(),
  },
  (table) => ({
    chainIdTxHashIdxUnique: unique(
      'dapp_tx_chain_id_transaction_hash_unique',
    ).on(table.txHash, table.chainId),
    chainIdx: index('dapp_tx_network_idx').on(table.chainId),
    restakingTokenIdx: index('dapp_tx_restaking_token_idx').on(
      table.restakingToken,
    ),
    timestampIdx: index('dapp_tx_timestamp_idx').on(table.timestamp),
    ipIdx: index('dapp_tx_ip_idx').on(table.ip),
    txHashIdx: index('dapp_tx_transaction_hash_idx').on(table.txHash),
    chainIdTxHashIdx: index('dapp_tx_chain_id_transaction_hash_idx').on(
      table.txHash,
      table.chainId,
    ),
  }),
);

export type DappDeposit = typeof dappDeposit.$inferSelect;
export type DappDepositInsert = typeof dappDeposit.$inferInsert;

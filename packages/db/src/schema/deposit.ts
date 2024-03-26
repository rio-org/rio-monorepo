import { uuid, index } from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { transaction } from './transaction';
import { network } from './network';
import { asset } from './asset';
import { account } from './account';

export const deposit = schema.table(
  'deposit',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    networkId: uuid('network_id')
      .references(() => network.id)
      .notNull(),
    accountId: uuid('account_id')
      .references(() => account.id)
      .notNull(),
    restakingTokenId: uuid('restaking_token_id')
      .references(() => asset.id)
      .notNull(),
    underlyingAssetId: uuid('underlying_asset_id')
      .references(() => asset.id)
      .notNull(),
    transactionId: uuid('transaction_id')
      .references(() => transaction.id)
      .notNull(),
  },
  (table) => ({
    networkIdx: index('deposit_network_idx').on(table.id),
    accountIdx: index('deposit_account_idx').on(table.accountId),
    restakingTokenIdx: index('deposit_restaking_token_idx').on(
      table.restakingTokenId,
    ),
    underlyingAssetIdx: index('deposit_underlying_asset_idx').on(
      table.underlyingAssetId,
    ),
    transactionIdx: index('deposit_transaction_idx').on(table.transactionId),
  }),
);

export type Deposit = typeof deposit.$inferSelect;
export type DepositInsert = typeof deposit.$inferInsert;

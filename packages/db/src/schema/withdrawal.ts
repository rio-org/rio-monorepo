import { uuid, index } from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { transaction } from './transaction';
import { network } from './network';
import { account } from './account';
import { asset } from './asset';

export const withdrawal = schema.table(
  'withdrawal',
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
    networkIdx: index('withdrawal_network_idx').on(table.id),
    accountIdx: index('withdrawal_account_idx').on(table.accountId),
    restakingTokenIdx: index('withdrawal_restaking_token_idx').on(
      table.restakingTokenId,
    ),
    underlyingAssetIdx: index('withdrawal_underlying_asset_idx').on(
      table.underlyingAssetId,
    ),
    transactionIdx: index('withdrarwral_transaction_idx').on(
      table.transactionId,
    ),
  }),
);

export type Withdrawal = typeof withdrawal.$inferSelect;
export type WithdrawalInsert = typeof withdrawal.$inferInsert;

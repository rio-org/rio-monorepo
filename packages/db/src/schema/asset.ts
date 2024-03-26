import { uuid, char, index, varchar } from 'drizzle-orm/pg-core';

import { schema } from './pg-schema';
import { network } from './network';

export const asset = schema.table(
  'asset',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    networkId: uuid('network_id')
      .references(() => network.id)
      .notNull(),
    name: varchar('name', { length: 32 }).notNull(),
    symbol: varchar('symbol', { length: 10 }).notNull(),
    address: char('address', { length: 42 }).notNull(),
  },
  (table) => ({
    networkIdx: index('asset_network_idx').on(table.networkId),
    symbolIdx: index('asset_symbol_idx').on(table.symbol),
    addressIdx: index('asset_address_idx').on(table.address),
  }),
);

export type Asset = typeof asset.$inferSelect;
export type AssetInsert = typeof asset.$inferInsert;

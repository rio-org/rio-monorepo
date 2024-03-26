import { uuid, char, index } from 'drizzle-orm/pg-core';
import { schema } from './pg-schema';

export const account = schema.table(
  'account',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    address: char('address', { length: 42 }).notNull(),
  },
  (table) => ({
    addressIdx: index('account_address_idx').on(table.address),
  }),
);

export type Account = typeof account.$inferSelect;
export type AccountInsert = typeof account.$inferInsert;

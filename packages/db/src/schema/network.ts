import { uuid, integer, varchar, index } from 'drizzle-orm/pg-core';
import { schema } from './pg-schema';

export const network = schema.table(
  'network',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: integer('chain_id').unique().notNull(),
    name: varchar('name', { length: 32 }).notNull(),
  },
  (table) => ({
    chainIdIdx: index('network_chain_id_idx').on(table.chainId),
  }),
);

export type Network = typeof network.$inferSelect;
export type NetworkInsert = typeof network.$inferInsert;

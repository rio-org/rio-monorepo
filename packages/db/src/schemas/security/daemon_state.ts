import { char, integer, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

import { schema } from './security_schema';

export const daemonTaskEnum = pgEnum('daemon_task', [
  'key_retrieval',
  'key_removal',
]);
export const daemonStatusEnum = pgEnum('daemon_status', ['running', 'paused']);

export const daemonTaskState = schema.table(
  'daemon_task_state',
  {
    chainId: integer('chain_id').notNull(),
    operatorRegistryAddress: char('operator_registry_address', {
      length: 42,
    }).notNull(),
    task: daemonTaskEnum('task').notNull().primaryKey(),
    status: daemonStatusEnum('status').default('running'),
    lastBlockNumber: integer('last_block_number').default(0).notNull(),
  },
  (table) => ({
    taskByOperatorRegistryRef: uniqueIndex(
      'daemon_task_state_task_by_operator_registry',
    ).on(table.task, table.operatorRegistryAddress),
  }),
);

export type DaemonTaskState = typeof daemonTaskState.$inferSelect;
export type DaemonTaskStateInsert = typeof daemonTaskState.$inferInsert;

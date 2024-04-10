import { pgEnum } from 'drizzle-orm/pg-core';

import { schema } from './security_schema';

export const daemonTaskEnum = pgEnum('daemon_task', [
  'key_retrieval',
  'key_removal',
]);
export const daemonStatusEnum = pgEnum('daemon_status', ['running', 'paused']);

export const daemonTaskState = schema.table('daemon_task_state', {
  task: daemonTaskEnum('task').notNull().primaryKey(),
  status: daemonStatusEnum('status').default('running'),
});

export type DaemonTaskState = typeof daemonTaskState.$inferSelect;
export type DaemonTaskStateInsert = typeof daemonTaskState.$inferInsert;

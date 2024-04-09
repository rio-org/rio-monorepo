import { CHAIN_ID } from './chain.types';

/**
 * The configuration for single cron task
 */
export interface TaskSyncDBCronTask {
  task: TaskSyncDBCronTaskName;
  chainIds: CHAIN_ID[];
}

/**
 * Options that are passed into all cron task modules
 */
export interface TaskSyncDBModuleOptions {
  tasks: TaskSyncDBCronTask[] | undefined;
}

export enum TaskSyncDBProvider {
  CRON_TASK = 'CRON_TASK',
}

/**
 * Names of all cron tasks
 */
export enum TaskSyncDBCronTaskName {
  SYNC_TRANSFERS = 'sync_transfers',
  SYNC_EXCHANGE_RATES = 'sync_exchange_rates',
}

import { CHAIN_ID } from './chain.types';

/**
 * The configuration for single cron task
 */
export interface CronTask {
  task: CronTaskName;
  chainIds: CHAIN_ID[];
}

/**
 * Options that are passed into all cron task modules
 */
export interface TaskSchedulerModuleOptions {
  tasks: CronTask[] | undefined;
}

export enum TaskSchedulerProvider {
  CRON_TASK = 'CRON_TASK',
}

/**
 * Names of all cron tasks
 */
export enum CronTaskName {
  SYNC_TRANSFERS = 'sync_transfers',
  SYNC_EXCHANGE_RATES = 'sync_exchange_rates',
}

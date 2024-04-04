import { CHAIN_ID } from './chain.types';

/**
 * The configuration for single cron task
 */
export interface CronTask {
  task: CronTaskName;
  cronExpression: string;
  chainId: CHAIN_ID;
  isEnabled: boolean;
}

/**
 * Options that are passed into all cron task modules
 */
export interface TaskSchedulerModuleOptions {
  tasks: CronTask[] | undefined;
}

export enum TaskSchedulerProvider {
  SUBGRAPH_CLIENT_PROVIDER = 'SUBGRAPH_CLIENT_PROVIDER',
}

/**
 * Names of all cron tasks
 */
export enum CronTaskName {
  SYNC_TRANSFERS = 'sync_transfers',
  SYNC_EXCHANGE_RATES = 'sync_exchange_rates',
}

/**
 * Any cron task default values
 */
export enum CronTaskDefaults {
  ENABLED = 'false',
  INTERVAL = 300, // 5 mins
}

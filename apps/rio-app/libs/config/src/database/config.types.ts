import { CHAIN_ID, CronTaskName } from '@rio-app/common';

/**
 * The configuration for single cron task
 */
export interface CronTask {
  task: CronTaskName;
  chainId?: CHAIN_ID;
}

/**
 * TaskScheduler service configuration values
 */
export interface TaskSchedulerServiceConfig {
  tasks: CronTask[];
}

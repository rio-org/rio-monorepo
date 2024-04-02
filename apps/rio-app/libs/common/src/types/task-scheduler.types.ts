import { CronTask } from '@rio-app/config';

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
  IMPORT_DATA = 'import_data',
}
/**
 * Any cron task default values
 */
export enum CronTaskDefaults {
  ENABLED = 'false',
  INTERVAL = 300, // 5 mins
}

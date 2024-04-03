import { CronTask } from '@rio-app/common';

/**
 * TaskScheduler service configuration values
 */
export interface TaskSchedulerServiceConfig {
  tasks: CronTask[];
}

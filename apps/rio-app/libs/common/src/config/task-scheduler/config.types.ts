import { CronTask } from '../../';

/**
 * TaskScheduler service configuration values
 */
export interface TaskSchedulerServiceConfig {
  tasks: CronTask[];
}

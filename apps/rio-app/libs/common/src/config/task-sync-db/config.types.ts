import { TaskSyncDBCronTask } from '../../';

/**
 * TaskScheduler service configuration values
 */
export interface TaskSyncDBServiceConfig {
  tasks: TaskSyncDBCronTask[];
}

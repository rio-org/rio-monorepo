import { Injectable } from '@nestjs/common';
import { SharedConfigService } from '../shared';
import { TaskSyncDBServiceConfig } from './config.types';
import { TaskSyncDBCronTask, TaskSyncDBCronTaskName } from '../../';
import { FormatService } from '../../utils';
import { ConfigService } from '@nestjs/config';

/**
 * Convenience service used to access task-sync-db service configuration values
 */
@Injectable()
export class TaskSyncDBConfigService extends SharedConfigService<TaskSyncDBServiceConfig> {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly formatService: FormatService,
  ) {
    super(configService, formatService);
  }

  /**
   * List of available cron tasks
   */
  public get tasks(): TaskSyncDBCronTask[] | undefined {
    return this.configService.get<TaskSyncDBCronTask[]>(this._accessor.tasks());
  }

  /**
   * Gets the properties of the specified cron task
   * @param taskName name of the cron task whose properties to get
   */
  public getTask(
    taskName: TaskSyncDBCronTaskName,
  ): TaskSyncDBCronTask | undefined {
    return this.tasks?.find((task) => task.task === taskName);
  }
}

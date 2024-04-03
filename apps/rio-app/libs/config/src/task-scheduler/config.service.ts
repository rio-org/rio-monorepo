import { Injectable } from '@nestjs/common';
import { SharedConfigService } from '../shared';
import { TaskSchedulerServiceConfig } from './config.types';
import { CronTask, CronTaskName, FormatService } from '@rio-app/common';
import { ConfigService } from '@nestjs/config';

/**
 * Convenience service used to access task-scheduler service configuration values
 */
@Injectable()
export class TaskSchedulerConfigService extends SharedConfigService<TaskSchedulerServiceConfig> {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly formatService: FormatService,
  ) {
    super(configService, formatService);
  }

  /**
   * List of available cron tasks
   */
  public get tasks(): CronTask[] | undefined {
    return this.configService.get<CronTask[]>(this._accessor.tasks());
  }

  /**
   * Gets the properties of the specified cron task
   * @param taskName name of the cron task whose properties to get
   */
  public getTask(taskName: CronTaskName): CronTask | undefined {
    return this.tasks?.find((task) => task.task === taskName);
  }
}

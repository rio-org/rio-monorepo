import { DynamicModule, Module } from '@nestjs/common';
import { CronTaskName, TaskSchedulerModuleOptions } from '@rio-app/common';
import { TaskSchedulerConfigModule } from '@rio-app/config';
import { ImportDataTaskManagerService } from './import-data-task-manager.service';

@Module({})
export class ImportDataTaskManagerModule {
  public static get task(): CronTaskName {
    return CronTaskName.IMPORT_DATA;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: TaskSchedulerModuleOptions): DynamicModule {
    if (options?.tasks?.filter(({ task }) => task === this.task).length === 0) {
      return {
        module: ImportDataTaskManagerModule,
      };
    }

    return {
      module: ImportDataTaskManagerModule,
      imports: [TaskSchedulerConfigModule],
      providers: [ImportDataTaskManagerService],
      exports: [ImportDataTaskManagerService],
    };
  }
}

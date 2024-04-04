import { DynamicModule, Module } from '@nestjs/common';
import { CronTaskName, TaskSchedulerModuleOptions } from '@rio-app/common';
import { TaskSchedulerConfigModule } from '@rio-app/common';
import { SyncTransfersTaskManagerService } from './sync-transfers-task-manager.service';
import { TaskSchedulerProviders } from '../../task-scheduler.providers';

@Module({})
export class SyncTransfersTaskManagerModule {
  public static get task(): CronTaskName {
    return CronTaskName.SYNC_TRANSFERS;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: TaskSchedulerModuleOptions): DynamicModule {
    const task = options?.tasks?.filter(({ task }) => task === this.task);
    console.log(task);
    if (task.length === 0) {
      return {
        module: SyncTransfersTaskManagerModule,
      };
    }

    return {
      module: SyncTransfersTaskManagerModule,
      imports: [TaskSchedulerConfigModule],
      providers: [
        SyncTransfersTaskManagerService,
        //    TaskSchedulerProviders.createSubgraphConnection(),
      ],
      exports: [SyncTransfersTaskManagerService],
    };
  }
}

import { DynamicModule, Module } from '@nestjs/common';
import {
  ChainService,
  CronTaskName,
  TaskSchedulerModuleOptions,
  TaskSchedulerProvider,
} from '@rio-app/common';
import { TaskSchedulerConfigModule } from '@rio-app/common';
import { SyncTransfersTaskManagerService } from './sync-transfers-task-manager.service';
import { SyncTransfersUtils } from './sync-transfers.utils';

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
    if (task.length === 0) {
      return {
        module: SyncTransfersTaskManagerModule,
      };
    }

    return {
      module: SyncTransfersTaskManagerModule,
      imports: [TaskSchedulerConfigModule],
      providers: [
        ChainService,
        SyncTransfersTaskManagerService,
        SyncTransfersUtils,
        { provide: TaskSchedulerProvider.CRON_TASK, useValue: task[0] },
      ],
      exports: [SyncTransfersTaskManagerService],
    };
  }
}

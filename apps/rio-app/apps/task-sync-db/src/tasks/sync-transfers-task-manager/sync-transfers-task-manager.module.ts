import { DynamicModule, Module } from '@nestjs/common';
import {
  ChainService,
  TaskSyncDBCronTaskName,
  TaskSyncDBModuleOptions,
  TaskSyncDBProvider,
} from '@rio-app/common';
import { TaskSyncDBConfigModule } from '@rio-app/common';
import { SyncTransfersTaskManagerService } from './sync-transfers-task-manager.service';
import { SyncTransfersUtils } from './sync-transfers.utils';

@Module({})
export class SyncTransfersTaskManagerModule {
  public static get task(): TaskSyncDBCronTaskName {
    return TaskSyncDBCronTaskName.SYNC_TRANSFERS;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: TaskSyncDBModuleOptions): DynamicModule {
    const task = options?.tasks?.filter(({ task }) => task === this.task);
    if (task.length === 0) {
      return {
        module: SyncTransfersTaskManagerModule,
      };
    }

    return {
      module: SyncTransfersTaskManagerModule,
      imports: [TaskSyncDBConfigModule],
      providers: [
        ChainService,
        SyncTransfersTaskManagerService,
        SyncTransfersUtils,
        { provide: TaskSyncDBProvider.CRON_TASK, useValue: task[0] },
      ],
      exports: [SyncTransfersTaskManagerService],
    };
  }
}

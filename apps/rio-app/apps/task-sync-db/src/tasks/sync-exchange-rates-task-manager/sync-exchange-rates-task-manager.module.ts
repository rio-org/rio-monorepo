import { DynamicModule, Module } from '@nestjs/common';
import {
  TaskSyncDBConfigModule,
  TaskSyncDBCronTaskName,
  TaskSyncDBModuleOptions,
  TaskSyncDBProvider,
} from '@rio-app/common';
import { SyncExchangeRatesTaskManagerService } from './sync-exchange-rates-task-manager.service';

@Module({})
export class SyncExchangeRatesTaskManagerModule {
  public static get task(): TaskSyncDBCronTaskName {
    return TaskSyncDBCronTaskName.SYNC_EXCHANGE_RATES;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: TaskSyncDBModuleOptions): DynamicModule {
    const task = options?.tasks?.filter(({ task }) => task === this.task);
    if (task.length === 0) {
      return {
        module: SyncExchangeRatesTaskManagerModule,
      };
    }

    return {
      module: SyncExchangeRatesTaskManagerModule,
      imports: [TaskSyncDBConfigModule],
      providers: [
        SyncExchangeRatesTaskManagerService,
        { provide: TaskSyncDBProvider.CRON_TASK, useValue: task[0] },
      ],
      exports: [SyncExchangeRatesTaskManagerService],
    };
  }
}

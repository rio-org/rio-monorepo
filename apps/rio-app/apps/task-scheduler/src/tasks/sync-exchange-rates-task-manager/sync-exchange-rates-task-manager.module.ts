import { DynamicModule, Module } from '@nestjs/common';
import {
  CronTaskName,
  TaskSchedulerModuleOptions,
  TaskSchedulerProvider,
} from '@rio-app/common';
import { TaskSchedulerConfigModule } from '@rio-app/common';
import { SyncExchangeRatesTaskManagerService } from './sync-exchange-rates-task-manager.service';

@Module({})
export class SyncExchangeRatesTaskManagerModule {
  public static get task(): CronTaskName {
    return CronTaskName.SYNC_EXCHANGE_RATES;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: TaskSchedulerModuleOptions): DynamicModule {
    const task = options?.tasks?.filter(({ task }) => task === this.task);
    if (task.length === 0) {
      return {
        module: SyncExchangeRatesTaskManagerModule,
      };
    }

    return {
      module: SyncExchangeRatesTaskManagerModule,
      imports: [TaskSchedulerConfigModule],
      providers: [
        SyncExchangeRatesTaskManagerService,
        { provide: TaskSchedulerProvider.CRON_TASK, useValue: task[0] },
      ],
      exports: [SyncExchangeRatesTaskManagerService],
    };
  }
}

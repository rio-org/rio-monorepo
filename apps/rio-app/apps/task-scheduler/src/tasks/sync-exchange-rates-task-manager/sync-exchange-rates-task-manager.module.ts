import { DynamicModule, Module } from '@nestjs/common';
import { CronTaskName, TaskSchedulerModuleOptions } from '@rio-app/common';
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
    if (options?.tasks?.filter(({ task }) => task === this.task).length === 0) {
      return {
        module: SyncExchangeRatesTaskManagerModule,
      };
    }

    return {
      module: SyncExchangeRatesTaskManagerModule,
      imports: [TaskSchedulerConfigModule],
      providers: [SyncExchangeRatesTaskManagerService],
      exports: [SyncExchangeRatesTaskManagerService],
    };
  }
}

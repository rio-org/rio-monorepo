import { DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DatabaseModule,
  DatabaseService,
  HealthModule,
  LoggerModule,
  TaskSyncDBConfigModule,
  TaskSyncDBConfigService,
  TaskSyncDBModuleOptions,
  UtilsModule,
} from '@rio-app/common';
import {
  SyncExchangeRatesTaskManagerModule,
  SyncTransfersTaskManagerModule,
} from './tasks';

@Module({
  imports: [TaskSyncDBConfigModule],
})
export class TaskSyncDBModule {
  /**
   * Register the module dynamically
   * @param moduleOptions The cron task module options
   */
  public static register(
    moduleOptions: TaskSyncDBModuleOptions,
  ): DynamicModule {
    return {
      module: TaskSyncDBModule,
      imports: [
        UtilsModule,
        HealthModule.forRootAsync({
          useFactory: ({ database, redis }) => {
            return {
              database,
              redis,
            };
          },
          inject: [TaskSyncDBConfigService],
        }),
        LoggerModule.forRootAsync({
          useFactory: ({ logger }: TaskSyncDBConfigService) => logger,
          inject: [TaskSyncDBConfigService],
        }),

        DatabaseModule.forRootAsync({
          useFactory: ({ database }: TaskSyncDBConfigService) => ({
            database,
          }),
          inject: [TaskSyncDBConfigService],
          exports: [DatabaseService],
        }),

        ScheduleModule.forRoot(),
        SyncExchangeRatesTaskManagerModule.register(moduleOptions),
        SyncTransfersTaskManagerModule.register(moduleOptions),
      ],
    };
  }
}

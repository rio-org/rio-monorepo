import { DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DatabaseModule,
  DatabaseService,
  HealthModule,
  LoggerModule,
  TaskSchedulerConfigModule,
  TaskSchedulerConfigService,
  TaskSchedulerModuleOptions,
  UtilsModule,
} from '@rio-app/common';
import {
  SyncExchangeRatesTaskManagerModule,
  SyncTransfersTaskManagerModule,
} from './tasks';
import { TaskSchedulerController } from './task-scheduler.controller';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({
  imports: [TaskSchedulerConfigModule],
})
export class TaskSchedulerModule {
  /**
   * Register the module dynamically
   * @param moduleOptions The cron task module options
   */
  public static register(
    moduleOptions: TaskSchedulerModuleOptions,
  ): DynamicModule {
    return {
      module: TaskSchedulerModule,
      imports: [
        UtilsModule,
        HealthModule.forRootAsync({
          useFactory: ({ database, redis }) => {
            return {
              database,
              redis,
            };
          },
          inject: [TaskSchedulerConfigService],
        }),
        LoggerModule.forRootAsync({
          useFactory: ({ logger }: TaskSchedulerConfigService) => logger,
          inject: [TaskSchedulerConfigService],
        }),

        DatabaseModule.forRootAsync({
          useFactory: ({ database }: TaskSchedulerConfigService) => ({
            database,
          }),
          inject: [TaskSchedulerConfigService],
          exports: [DatabaseService],
        }),

        ScheduleModule.forRoot(),
        SyncExchangeRatesTaskManagerModule.register(moduleOptions),
        SyncTransfersTaskManagerModule.register(moduleOptions),
      ],
      controllers: [TaskSchedulerController],
      providers: [TaskSchedulerService],
    };
  }
}

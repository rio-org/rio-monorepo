import { DynamicModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DatabaseModule,
  DatabaseService,
  HealthModule,
  LoggerModule,
  SecurityDaemonConfigModule,
  SecurityDaemonConfigService,
  SecurityDaemonModuleOptions,
  UtilsModule,
} from '@rio-app/common';
import {
  SyncValidatorKeysTaskManagerModule,
  ProcessRemovalQueueTaskManagerModule,
} from './tasks';

@Module({
  imports: [SecurityDaemonConfigModule],
})
export class SecurityDaemonModule {
  /**
   * Register the module dynamically
   * @param moduleOptions The cron task module options
   */
  public static register(
    moduleOptions: SecurityDaemonModuleOptions,
  ): DynamicModule {
    return {
      module: SecurityDaemonModule,
      imports: [
        UtilsModule,
        HealthModule.forRootAsync({
          useFactory: ({ database, redis }) => {
            return {
              database,
              redis,
            };
          },
          inject: [SecurityDaemonConfigService],
        }),
        LoggerModule.forRootAsync({
          useFactory: ({ logger }: SecurityDaemonConfigService) => logger,
          inject: [SecurityDaemonConfigService],
        }),

        DatabaseModule.forRootAsync({
          useFactory: ({ database }: SecurityDaemonConfigService) => ({
            database,
          }),
          inject: [SecurityDaemonConfigService],
          exports: [DatabaseService],
        }),

        ScheduleModule.forRoot(),
        SyncValidatorKeysTaskManagerModule.register(moduleOptions),
        ProcessRemovalQueueTaskManagerModule.register(moduleOptions),
      ],
    };
  }
}

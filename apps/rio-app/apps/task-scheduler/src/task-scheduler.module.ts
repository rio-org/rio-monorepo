import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule } from '@svtslv/nestjs-ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisCacheService, TaskSchedulerModuleOptions } from '@rio-app/common';
import { LoggerModule, LoggerService, HealthModule } from '@rio-app/common';
import {
  TaskSchedulerConfigModule,
  TaskSchedulerConfigService,
} from '@rio-app/config';
import { ImportDataTaskManagerModule } from './tasks';
import { TaskSchedulerController } from './task-scheduler.controller';
import { TaskSchedulerService } from './task-scheduler.service';
import { TaskSchedulerProviders } from './task-scheduler.providers';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

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
          exports: [LoggerService],
        }),
        // RedisModule.forRootAsync({
        //   useFactory: ({ redis }: TaskSchedulerConfigService) => ({
        //     config: {
        //       url: redis.url,
        //     },
        //   }),
        //   inject: [TaskSchedulerConfigService],
        // }),

        // CacheModule.registerAsync({
        //   isGlobal: true,
        //   imports: [TaskSchedulerConfigModule],
        //   useFactory: async ({
        //     redis,
        //     redisCache,
        //   }: TaskSchedulerConfigService) => ({
        //     ttl: redisCache.ttl,
        //     store: (await redisStore({
        //       url: redis.url,
        //       // @ts-ignore
        //       store: undefined,
        //     })) as unknown as CacheStore,
        //   }),
        //   inject: [TaskSchedulerConfigService],
        // }),
        ScheduleModule.forRoot(),
        ImportDataTaskManagerModule.register(moduleOptions),
      ],
      controllers: [TaskSchedulerController],
      providers: [
        // RedisCacheService,
        TaskSchedulerService,
      ],
    };
  }
}

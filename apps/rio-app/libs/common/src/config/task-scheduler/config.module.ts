import { Global, Module } from '@nestjs/common';
import configuration from './task-scheduler.config';
import { TaskSchedulerConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedConfigModule } from '../shared';

/**
 * Import and provide configuration related classes
 */
@Global()
@Module({
  imports: [
    SharedConfigModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['task-scheduler.env'],
    }),
  ],
  providers: [ConfigService, TaskSchedulerConfigService],
  exports: [ConfigService, TaskSchedulerConfigService],
})
export class TaskSchedulerConfigModule {}

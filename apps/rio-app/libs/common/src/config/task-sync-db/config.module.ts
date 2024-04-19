import { Global, Module } from '@nestjs/common';
import configuration from './task-sync-db.config';
import { TaskSyncDBConfigService } from './config.service';
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
      envFilePath: ['task-sync-db.env'],
    }),
  ],
  providers: [ConfigService, TaskSyncDBConfigService],
  exports: [ConfigService, TaskSyncDBConfigService],
})
export class TaskSyncDBConfigModule {}

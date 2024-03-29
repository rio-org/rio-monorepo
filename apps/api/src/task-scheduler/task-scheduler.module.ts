import { Module } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { DatabaseModule } from '@/libs/common/database/database.module';

export interface ConfigModuleOptions {
  folder: string;
}

@Module({
  imports: [DatabaseModule],
  providers: [TaskSchedulerService],
  exports: [TaskSchedulerService],
})
export class TaskSchedulerModule {}

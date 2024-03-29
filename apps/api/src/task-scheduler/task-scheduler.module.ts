import { Module } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({
  providers: [TaskSchedulerService],
})
export class TaskSchedulerModule {}

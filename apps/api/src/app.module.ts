import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskSchedulerModule } from './task-scheduler/task-scheduler.module';

@Module({
  imports: [ScheduleModule.forRoot(), TaskSchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

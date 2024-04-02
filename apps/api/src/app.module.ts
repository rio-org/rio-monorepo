import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskSchedulerModule } from './task-scheduler/task-scheduler.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [RewardsModule],
  // imports: [ScheduleModule.forRoot(), TaskSchedulerModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}

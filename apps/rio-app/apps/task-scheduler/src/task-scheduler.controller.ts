import { LoggingInterceptor } from '@rio-app/common';
import { LoggerService } from '@rio-app/common';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { TaskSchedulerConfigService } from '@rio-app/config';

@Controller()
@UseInterceptors(LoggingInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class TaskSchedulerController {
  constructor(
    private readonly _service: TaskSchedulerService,
    private readonly _config: TaskSchedulerConfigService,
    private readonly _logger: LoggerService,
  ) {
    this._logger.setContext(this.constructor.name);
  }

  /**
   * Bootstrap
   */
  async onApplicationBootstrap(): Promise<void> {}
}

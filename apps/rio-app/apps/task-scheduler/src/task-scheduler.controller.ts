import { LoggingInterceptor } from '@rio-app/common';
import { LoggerService } from '@rio-app/common';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
@UseInterceptors(LoggingInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class TaskSchedulerController {
  constructor(private readonly _logger: LoggerService) {
    this._logger.setContext(this.constructor.name);
  }
}

import { LoggerService } from '@rio-app/common';
import { Injectable } from '@nestjs/common';
import { TaskSchedulerConfigService } from '@rio-app/common';

@Injectable()
export class TaskSchedulerService {
  constructor(
    private readonly _config: TaskSchedulerConfigService,
    protected readonly _logger: LoggerService,
  ) {
    this._logger.setContext(this.constructor.name);
  }
}

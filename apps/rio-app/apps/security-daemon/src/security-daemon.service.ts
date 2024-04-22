import { LoggerService } from '@rio-app/common';
import { Injectable } from '@nestjs/common';
import { SecurityDaemonConfigService } from '@rio-app/common';

@Injectable()
export class SecurityDaemonService {
  constructor(
    private readonly _config: SecurityDaemonConfigService,
    protected readonly _logger: LoggerService,
  ) {
    this._logger.setContext(this.constructor.name);
  }
}

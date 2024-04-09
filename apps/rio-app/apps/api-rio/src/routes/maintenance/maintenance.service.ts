import { Injectable } from '@nestjs/common';
import { LoggerService } from '@rio-app/common';

@Injectable()
export class MaintenanceService {
  constructor(private readonly _logger: LoggerService) {}
  /**
   * Returns the current time in millis
   */
  getTime(): string {
    return Date.now().toString();
  }
}

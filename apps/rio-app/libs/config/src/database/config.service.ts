import { Injectable } from '@nestjs/common';
import {
  DatabaseConfig,
  SharedConfigService,
  getSharedConfig,
} from '../shared';
import { FormatService } from '@rio-app/common';
import { ConfigService } from '@nestjs/config';

/**
 * Convenience service used to access task-scheduler service configuration values
 */
@Injectable()
export class DatabaseConfigService extends SharedConfigService<DatabaseConfig> {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly formatService: FormatService,
  ) {
    super(configService, formatService);
  }

  public getConfig() {
    return getSharedConfig().database;
  }
}

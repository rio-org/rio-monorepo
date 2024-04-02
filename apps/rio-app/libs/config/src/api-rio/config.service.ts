import { Injectable } from '@nestjs/common';
import { SharedConfigService } from '../shared';
import { ApiRioConfig } from './config.types';
import { FormatService } from '@rio-app/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerOptions } from '@nestjs/throttler';

/**
 * Convenience service used to access minder api configuration values
 */
@Injectable()
export class ApiRioConfigService extends SharedConfigService<ApiRioConfig> {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly formatService: FormatService,
  ) {
    super(configService, formatService);
  }

  /**
   * API throttlers config
   */
  public get throttlers(): ThrottlerOptions[] | undefined {
    return this.configService.get<ThrottlerOptions[]>(
      this._accessor.throttlers(),
    );
  }

  /**
   * API root URL location
   */
  public get rootLocation(): string {
    return this.configService.get<string>(this._accessor.rootLocation());
  }
}

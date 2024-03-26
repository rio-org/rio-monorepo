import { Injectable } from '@nestjs/common';
import type { IEnvironment } from './shared-config.types';
import { SharedConfigAdapter } from './shared-config.apapter';

@Injectable()
export class ConfigService implements SharedConfigAdapter {
  constructor(private readonly env: IEnvironment) {}

  getEnvVar(key: keyof IEnvironment) {
    return this.env[key];
  }
}

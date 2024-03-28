import { Injectable } from '@nestjs/common';
import type { ISharedConfigEnvironment } from './shared-config.types';
import { SharedConfigAdapter } from './shared-config.adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedConfigService implements SharedConfigAdapter {
  private readonly env: ISharedConfigEnvironment;

  constructor(private readonly configService: ConfigService) {
    this.env = {
      PORT: parseInt(`${this.configService.get<string>('PORT') ?? 4000}`),
      DB_HOST: this.configService.get<string>('DB_HOST') || 'localhost',
      DB_PORT: parseInt(`${this.configService.get<string>('DB_PORT') ?? 5432}`),
      DB_USER: this.configService.get<string>('DB_USER') || 'postgres',
      DB_PASSWORD: this.configService.get<string>('DB_PASSWORD') || 'postgres',
      DB_NAME: this.configService.get<string>('DB_NAME') || 'rio-restaking',
    };
  }

  getEnv() {
    return this.env;
  }

  getEnvVar<T extends keyof ISharedConfigEnvironment>(
    key: T,
  ): ISharedConfigEnvironment[T] {
    return this.env[key];
  }
}

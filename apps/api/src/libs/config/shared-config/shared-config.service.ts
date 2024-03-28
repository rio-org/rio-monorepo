import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import type { ISharedConfigEnvironment } from './shared-config.types';
import { CONFIG_OPTIONS } from './shared-config.constants';
import { ConfigOptions, EnvConfig } from './interfaces';

@Injectable()
export class SharedConfigService {
  private readonly envConfig: EnvConfig;
  private readonly env: ISharedConfigEnvironment;

  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(
      __dirname,
      '../../../../',
      options.folder,
      filePath,
    );
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    this.env = {
      PORT: parseInt(`${this.envConfig.PORT || 4000}`),
      DB_HOST: this.envConfig.DB_HOST || 'localhost',
      DB_PORT: parseInt(`${this.envConfig.DB_PORT || 5432}`),
      DB_USER: this.envConfig.DB_USER || 'postgres',
      DB_PASSWORD: this.envConfig.DB_PASSWORD || 'postgres',
      DB_NAME: this.envConfig.DB_NAME || 'rio-restaking',
    };

    console.log(this.env);
  }

  getEnv() {
    return this.env;
  }

  get<T extends keyof ISharedConfigEnvironment>(
    key: T,
  ): ISharedConfigEnvironment[T] {
    return this.env[key];
  }
}

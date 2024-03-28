import { ISharedConfigEnvironment } from './shared-config.types';

export abstract class SharedConfigAdapter {
  abstract getEnv(): ISharedConfigEnvironment;
  abstract getEnvVar<T extends keyof ISharedConfigEnvironment>(
    key: T,
  ): ISharedConfigEnvironment[T];
}

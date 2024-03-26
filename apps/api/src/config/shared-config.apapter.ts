import { IEnvironment } from './shared-config.types';

export abstract class SharedConfigAdapter {
  abstract getEnvVar<T extends keyof IEnvironment>(key: T): IEnvironment[T];
}

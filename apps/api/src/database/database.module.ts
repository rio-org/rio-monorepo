import { Global, DynamicModule } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './database.definition';
import { DatabaseService } from './database.service';

@Global()
export class DatabaseModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);
    return {
      ...props,
      providers: [
        ...providers,
        DatabaseService,
        {
          provide: options?.tag || 'default',
          useFactory: async (databaseService: DatabaseService) => {
            return await {
              connection: databaseService.getConnection(),
              poolConnection: databaseService.getPoolConnection(),
            };
          },
          inject: [DatabaseService],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const {
      providers = [],
      exports = [],
      ...props
    } = super.registerAsync(options);
    return {
      ...props,
      providers: [
        ...providers,
        DatabaseService,
        {
          provide: options?.tag || 'default',
          useFactory: async (databaseService: DatabaseService) => {
            return await {
              connection: databaseService.getConnection(),
              poolConnection: databaseService.getPoolConnection(),
            };
          },
          inject: [DatabaseService, MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [...exports, options?.tag || 'default'],
    };
  }
}

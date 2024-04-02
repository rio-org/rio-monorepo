import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { createDynamicRootModule } from '../';
import { LoggerModuleOptions, LoggerProvider } from './logger.types';

@Global()
@Module({})
export class LoggerModule extends createDynamicRootModule<LoggerModuleOptions>(
  LoggerProvider.LOGGER_MODULE_OPTIONS,
  {
    providers: [
      LoggerService,
      {
        provide: LoggerProvider.GENERAL_LOGGER_OPTIONS,
        useFactory: (options: LoggerModuleOptions) => options?.general,
        inject: [LoggerProvider.LOGGER_MODULE_OPTIONS],
      },
    ],
    exports: [LoggerService],
  },
) {}

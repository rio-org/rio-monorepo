import { DynamicModule, Global, Module } from '@nestjs/common';
import { SharedConfigService } from './shared-config.service';
import { CONFIG_OPTIONS } from './shared-config.constants';

export interface ConfigModuleOptions {
  folder: string;
}

@Global()
@Module({})
export class SharedConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      module: SharedConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        SharedConfigService,
      ],
      exports: [SharedConfigService],
    };
  }
}

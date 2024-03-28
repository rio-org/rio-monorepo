import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import { SharedConfigService } from './shared-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  providers: [ConfigService, SharedConfigService],
  exports: [ConfigService, SharedConfigService],
})
export class SharedConfigModule {}

import { Module } from '@nestjs/common';
import { getSharedConfig, sharedConfigPath } from './shared.config';
import { SharedConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsModule } from '../../utils';
import { LoggerModule } from '../../logger';

/**
 * Import and provide configuration related classes
 */
@Module({
  imports: [
    UtilsModule,
    LoggerModule,
    ConfigModule.forRoot({
      load: [getSharedConfig],
      envFilePath: sharedConfigPath,
    }),
  ],
  providers: [ConfigService, SharedConfigService],
  exports: [ConfigService, SharedConfigService],
})
export class SharedConfigModule {}

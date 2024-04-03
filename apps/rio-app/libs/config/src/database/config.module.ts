import { Global, Module } from '@nestjs/common';
import { DatabaseConfigService } from './config.service';
import { ConfigService } from '@nestjs/config';
import { SharedConfigModule } from '../shared';

/**
 * Import and provide configuration related classes
 */
@Global()
@Module({
  imports: [SharedConfigModule],
  providers: [ConfigService, DatabaseConfigService],
  exports: [ConfigService, DatabaseConfigService],
})
export class DatabaseConfigModule {}

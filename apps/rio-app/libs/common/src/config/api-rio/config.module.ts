import { Global, Module } from '@nestjs/common';
import configuration from './api-rio.config';
import { ApiRioConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedConfigModule } from '../shared/config.module';

/**
 * Import and provide configuration related classes
 */
@Global()
@Module({
  imports: [
    SharedConfigModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['api-rio.env'],
    }),
  ],
  providers: [ConfigService, ApiRioConfigService],
  exports: [ConfigService, ApiRioConfigService],
})
export class ApiRioConfigModule {}

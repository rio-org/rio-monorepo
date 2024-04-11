import { Global, Module } from '@nestjs/common';
import configuration from './security-daemon.config';
import { SecurityDaemonConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedConfigModule } from '../shared';

/**
 * Import and provide configuration related classes
 */
@Global()
@Module({
  imports: [
    SharedConfigModule,
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['security-daemon.env'],
    }),
  ],
  providers: [ConfigService, SecurityDaemonConfigService],
  exports: [ConfigService, SecurityDaemonConfigService],
})
export class SecurityDaemonConfigModule {}

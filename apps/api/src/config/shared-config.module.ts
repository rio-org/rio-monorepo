import { Module } from '@nestjs/common';

import { SharedConfigService } from './shared-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [],
  providers: [SharedConfigService],
})
export class SharedConfigModule {}

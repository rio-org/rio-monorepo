import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SharedConfigModule } from '@/libs/config/shared-config/shared-config.module';
import { SharedConfigService } from '@/libs/config/shared-config/shared-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' }), SharedConfigModule],
  controllers: [],
  providers: [SharedConfigService, DatabaseService],
  exports: [SharedConfigService, DatabaseService],
})
export class DatabaseModule {}

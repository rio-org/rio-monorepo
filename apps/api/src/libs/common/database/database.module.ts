import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SharedConfigModule } from '@/libs/config/shared-config/shared-config.module';
import { SharedConfigService } from '@/libs/config/shared-config/shared-config.service';

@Module({
  imports: [SharedConfigModule.register({ folder: '.' })],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SharedConfigModule } from '@/libs/config/shared-config/shared-config.module';

@Global()
@Module({
  imports: [SharedConfigModule.register({ folder: '.' })],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

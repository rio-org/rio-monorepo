import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DatabaseModule } from '@/libs/common/database/database.module';
import { SharedConfigModule } from '@/libs/config/shared-config/shared-config.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}

import { Global, Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { SharedConfigModule, SharedConfigService } from '../..';

@Global()
@Module({
  imports: [SharedConfigModule],
  providers: [SharedConfigService, DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}

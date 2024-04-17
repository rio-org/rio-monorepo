import { Global, Module } from '@nestjs/common';
import { DiscordLoggerService } from './discord-logger.service';
import { createDynamicRootModule } from '../..';
import { DiscordLoggerProviders } from './discord-logger.providers';
import {
  DiscordLoggerModuleOptions,
  DiscordLoggerProvider,
} from './discord-logger.types';

@Global()
@Module({})
export class DiscordLoggerModule extends createDynamicRootModule<DiscordLoggerModuleOptions>(
  DiscordLoggerProvider.DISCORD_LOGGER_MODULE_OPTIONS,
  {
    providers: [
      DiscordLoggerService,
      DiscordLoggerProviders.createDiscordLoggerProvider(),
    ],
  },
) {}

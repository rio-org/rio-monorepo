import {
  DiscordLoggerModuleOptions,
  DiscordLoggerProvider,
} from './discord-logger.types';

export class DiscordLoggerProviders {
  /**
   * Create a provider for the DiscordLogger
   */
  public static createDiscordLoggerProvider() {
    return {
      provide: DiscordLoggerProvider.DISCORD_LOGGER_CONFIGURATION,
      useFactory: (options: DiscordLoggerModuleOptions) => {
        return options.discordLogger;
      },
      inject: [DiscordLoggerProvider.DISCORD_LOGGER_MODULE_OPTIONS],
    };
  }
}

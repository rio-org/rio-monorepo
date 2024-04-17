export enum DiscordLoggerProvider {
  DISCORD_LOGGER_CONFIGURATION = 'DISCORD_LOGGER_CONFIGURATION',
  DISCORD_LOGGER_MODULE_OPTIONS = 'DISCORD_LOGGER_MODULE_OPTIONS',
}

export interface DiscordLoggerModuleOptions {
  discordLogger: DiscordLoggerConfig;
}

/**
 * Discord Logger configuration values
 */
export interface DiscordLoggerConfig {
  warn: string;
  error: string;
}

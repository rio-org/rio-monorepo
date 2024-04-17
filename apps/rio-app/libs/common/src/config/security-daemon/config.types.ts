import { SecurityDaemonCronTask } from '../..';

/**
 * TaskScheduler service configuration values
 */
export interface SecurityDaemonServiceConfig {
  tasks: SecurityDaemonCronTask[];
  privateKey: string;
  discordLogger: SecurityDaemonDiscordChannels;
}

export type SecurityDaemonDiscordChannels = {
  warn: string;
  error: string;
};

export type SecurityDaemonAccount = {
  privateKey?: string;
};

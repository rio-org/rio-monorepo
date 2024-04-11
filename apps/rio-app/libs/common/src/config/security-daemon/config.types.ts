import { SecurityDaemonCronTask } from '../..';

/**
 * TaskScheduler service configuration values
 */
export interface SecurityDaemonServiceConfig {
  tasks: SecurityDaemonCronTask[];
  privateKey: string;
}

export type SecurityDaemonAccount = {
  privateKey?: string;
};

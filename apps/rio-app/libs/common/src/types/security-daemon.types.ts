import { CHAIN_ID } from './chain.types';

/**
 * The configuration for single cron task
 */
export interface SecurityDaemonCronTask {
  task: SecurityDaemonCronTaskName;
  chainIds: CHAIN_ID[];
}

/**
 * Options that are passed into all cron task modules
 */
export interface SecurityDaemonModuleOptions {
  tasks: SecurityDaemonCronTask[] | undefined;
}

export enum SecurityDaemonProvider {
  CRON_TASK = 'CRON_TASK',
}

/**
 * Names of all cron tasks
 */
export enum SecurityDaemonCronTaskName {
  SYNC_VALIDATOR_KEYS = 'sync_validator_keys',
  PROCESS_REMOVAL_QUEUE = 'process_removal_queue',
}

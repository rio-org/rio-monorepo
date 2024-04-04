import { LogLevel } from '@nestjs/common';
import * as winston from 'winston';

/**
 * General logger options
 */
export interface GeneralLoggerOptions extends winston.LoggerOptions {
  context?: string;
  isTimestampEnabled?: boolean;
  isTimestampISO?: boolean; // print timestamp in ISO format including milliseconds or default to human-friendly
  logLevels?: LogLevel[]; // Default: ['error', 'warn', 'log', 'verbose', 'debug']
}

/**
 * Options required to log to slack
 */
export interface SlackLoggerOptions {
  webhookUrl: string;
  environment: string;
  logLevels?: LogLevel[]; // Default: ['warn', 'error']
}

/**
 * All logger module options
 */
export interface LoggerModuleOptions {
  general?: GeneralLoggerOptions;
  slack?: SlackLoggerOptions;
}

/**
 * Supported logger providers
 */
export enum LoggerProvider {
  LOGGER_MODULE_OPTIONS = 'LOGGER_MODULE_OPTIONS',
  GENERAL_LOGGER_OPTIONS = 'GENERAL_LOGGER_OPTIONS',
}

/**
 * A slack webhook message object
 */
export interface SlackWebhookOptions {
  message: any;
  context?: string;
  color?: string;
  trace?: string;
  traceId?: string;
}

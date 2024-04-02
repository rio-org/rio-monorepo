import {
  ConsoleLogger,
  Global,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import * as winston from 'winston';
import { GeneralLoggerOptions, LoggerProvider } from './logger.types';

@Global()
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private _logger: WinstonLogger;

  constructor(
    @Inject(LoggerProvider.GENERAL_LOGGER_OPTIONS)
    private readonly _opts?: GeneralLoggerOptions,
  ) {
    const logLevels = _opts?.logLevels || [
      'error',
      'warn',
      'log',
      'verbose',
      'debug',
    ];
    const logLevel = logLevels.slice(-1)[0];

    // @ts-ignore
    super(_opts?.context, {
      timestamp: _opts?.isTimestampEnabled,
      logLevels,
    });
    this.context = _opts?.context || '';

    this._logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          // Translate Nest "log" level to Winston "info" equivalent
          level: logLevel === 'log' ? 'info' : logLevel, // The "max" level of message allowed logged to Console
          format: winston.format.combine(
            // Add a timestamp to the console logs
            winston.format.timestamp(),
            // Add colors to you logs
            winston.format.colorize(),
            // What the details you need as logs
            winston.format.printf(
              ({ timestamp, level, message, context, trace }) => {
                return `${timestamp} [${context}] ${level}: ${message}${
                  trace ? `\n${trace}` : ''
                }`;
              },
            ),
          ),
        }),
      ],
      ...(_opts || {}),
    });
  }

  /**
   * Write a 'debug' level log to stdout
   * @param message Message to write
   * @param context Optional context name
   */
  debug(message: any, context?: string): void {
    this._logger.debug(message, { context: context || this.context });
  }

  /**
   * Write a 'verbose' level log to stdout
   * @param message Message to write
   * @param context Optional context name
   */
  verbose(message: string, context?: string): void {
    this._logger.verbose(message, { context: context || this.context });
  }

  /**
   * Write a 'info' level log to stdout
   * Send the message to slack if configured
   * @param message Message to write
   * @param context Optional context name
   */
  log(message: string, context?: string): void {
    this._logger.info(message, { context: context || this.context });
  }

  /**
   * Write a 'warn' level log to stdout
   * Send the message to slack if configured
   * @param message Message to write
   * @param context Optional context name
   */
  warn(message: string, context?: string): void {
    this._logger.warn(message, { context: context || this.context });
  }

  /**
   * Write an 'error' level log to stderr
   * Send the message to slack if configured
   * @param message Error message to write
   * @param trace Optional trace string
   * @param context Optional context name
   */
  error(message: string, trace?: string, context?: string): void {
    this._logger.error(message, { context: context || this.context });
  }
}

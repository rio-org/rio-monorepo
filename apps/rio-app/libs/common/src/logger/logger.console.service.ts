import {
  ConsoleLogger,
  Global,
  Inject,
  Injectable,
  LogLevel,
  Optional,
  Scope,
} from '@nestjs/common';

@Global()
@Injectable({ scope: Scope.TRANSIENT })
export class ConsoleLoggerService extends ConsoleLogger {
  /**
   * Write a 'log' level log to stdout
   * @param originalMessage Message to write
   * @param context Optional context name
   * @param context Optional trace id to write
   */
  log(message: string, context?: string, traceId?: string): void {
    super.log(message, context || this.context);
  }

  /**
   * Write a 'warn' level log to stdout, including the existing TraceID if available
   * Send the message to slack if configured
   * @param originalMessage Message to write
   * @param context Optional context name
   */
  warn(originalMessage: string, context?: string): void {
    super.warn(originalMessage, context || this.context);
  }

  /**
   * Write an 'error' level log to stderr, including the existing TraceID if available
   * Sends the message to slack and sentry if configured
   *
   * @param message Error message to write
   * @param trace Optional trace string
   * @param context Optional context name
   */
  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace || '', context || this.context);
  }
}

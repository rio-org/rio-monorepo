import { LoggerService as ILogger } from '@nestjs/common';

/**
 * Attach global exception & promise rejection handlers
 * @param logger A compatible logger service
 */
export function attachGlobalExceptionHandlers(logger: ILogger): void {
  process.on('uncaughtException', (error: Error | unknown) => {
    const errorType = 'Uncaught Exception';
    if (error instanceof Error) {
      logger.error(`${errorType}: ${error.message}`, error.stack);
    } else {
      logger.error(`${errorType}: ${error}`);
    }
    // Sentry.close().then(() => {
    //   process.exit(1);
    // });
  });
  process.on('unhandledRejection', (error: Error) => {
    const errorType = 'Unhandled Promise Rejection';
    if (error instanceof Error) {
      logger.error(`${errorType}: ${error.message}`, error.stack);
    } else {
      logger.error(`${errorType}: ${error}`);
    }
    // Sentry.close().then(() => {
    //   process.exit(1);
    // });
  });
}

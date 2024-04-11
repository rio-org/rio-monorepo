import { NestFactory } from '@nestjs/core';
import { ShutdownSignal } from '@nestjs/common';
import { LoggerService } from '@rio-app/common';
import { SecurityDaemonModule } from './security-daemon.module';
import { SecurityDaemonConfigService } from '@rio-app/common';
import { configure } from '@rio-app/common';
import { attachGlobalExceptionHandlers } from '@rio-app/common';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(
    SecurityDaemonModule,
  );
  const { tasks, httpPorts } = context.get<SecurityDaemonConfigService>(
    SecurityDaemonConfigService,
  );
  const app = await NestFactory.create(
    SecurityDaemonModule.register({
      tasks,
    }),
  );
  const logger = await app.resolve(LoggerService);
  attachGlobalExceptionHandlers(logger);
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGTERM]);
  await app.startAllMicroservices();

  await app.listen(httpPorts.securityDaemonService);
  logger.log(
    `Service is listening on port ${httpPorts.securityDaemonService} ...`,
    'Main',
  );
}
configure();
bootstrap();

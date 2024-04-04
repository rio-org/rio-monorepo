import { NestFactory } from '@nestjs/core';
import { ShutdownSignal } from '@nestjs/common';
import { LoggerService } from '@rio-app/common';
import { TaskSchedulerModule } from './task-scheduler.module';
import { TaskSchedulerConfigService } from '@rio-app/common';
import { configure } from '@rio-app/common';
import { attachGlobalExceptionHandlers } from '@rio-app/common';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(
    TaskSchedulerModule,
  );
  const { tasks, httpPorts } = context.get<TaskSchedulerConfigService>(
    TaskSchedulerConfigService,
  );
  const app = await NestFactory.create(
    TaskSchedulerModule.register({
      tasks,
    }),
  );
  const logger = await app.resolve(LoggerService);
  attachGlobalExceptionHandlers(logger);
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGTERM]);
  await app.startAllMicroservices();

  await app.listen(httpPorts.taskSchedulerService);
  logger.log(
    `Service is listening on port ${httpPorts.taskSchedulerService} ...`,
    'Main',
  );
}
configure();
bootstrap();

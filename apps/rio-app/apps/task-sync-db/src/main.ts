import { NestFactory } from '@nestjs/core';
import { ShutdownSignal } from '@nestjs/common';
import { LoggerService } from '@rio-app/common';
import { TaskSyncDBConfigService } from '@rio-app/common';
import { configure } from '@rio-app/common';
import { attachGlobalExceptionHandlers } from '@rio-app/common';
import { TaskSyncDBModule } from './task-sync-db.module';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(TaskSyncDBModule);
  const { tasks, httpPorts } = context.get<TaskSyncDBConfigService>(
    TaskSyncDBConfigService,
  );
  const app = await NestFactory.create(
    TaskSyncDBModule.register({
      tasks,
    }),
  );
  const logger = await app.resolve(LoggerService);
  attachGlobalExceptionHandlers(logger);
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGTERM]);
  await app.startAllMicroservices();

  await app.listen(httpPorts.taskSyncDBService);
  logger.log(
    `Task SyncDB Service is listening on port ${httpPorts.taskSyncDBService} ...`,
    'Main',
  );
}
configure();
bootstrap();

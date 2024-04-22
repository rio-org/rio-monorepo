import { NestFactory } from '@nestjs/core';
import { ShutdownSignal } from '@nestjs/common';
import { LoggerService, RebalancerBotConfigService } from '@rio-app/common';
import { configure } from '@rio-app/common';
import { attachGlobalExceptionHandlers } from '@rio-app/common';
import { RebalancerBotModule } from './rebalancer-bot.module';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(
    RebalancerBotModule,
  );
  const { bots, httpPorts } = context.get<RebalancerBotConfigService>(
    RebalancerBotConfigService,
  );
  const app = await NestFactory.create(
    RebalancerBotModule.registerAsync({
      bots,
    }),
  );
  const logger = await app.resolve(LoggerService);
  attachGlobalExceptionHandlers(logger);
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGTERM]);
  await app.startAllMicroservices();

  await app.listen(httpPorts.rebalancerBotService);
  logger.log(
    `Rebalancer Bot Service is listening on port ${httpPorts.taskSyncDBService} ...`,
    'Main',
  );
}

configure();
bootstrap();

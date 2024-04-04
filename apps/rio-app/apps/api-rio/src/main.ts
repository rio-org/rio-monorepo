import { NestFactory } from '@nestjs/core';
import { ShutdownSignal, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { ApiRioConfigService } from '@rio-app/common';
import {
  LoggerService,
  attachGlobalExceptionHandlers,
  configure,
} from '@rio-app/common';
import { ApiRioModule } from './api-rio.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  // Define the App
  const app = await NestFactory.create(ApiRioModule, { cors: true });
  const protectedRoutes = ['/metrics', '/health'];

  // Pull app configurations
  const { httpPorts, rootLocation } =
    app.get<ApiRioConfigService>(ApiRioConfigService);

  app.setGlobalPrefix(rootLocation, { exclude: protectedRoutes });

  // Setup logger
  const logger = await app.resolve(LoggerService);
  attachGlobalExceptionHandlers(logger);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Rio REST API')
    .setDescription('Swagger docs for Rio API')
    .setVersion('1.0')
    .addServer(rootLocation)
    //.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });

  // Ensure proper shutdown procedures
  app.enableShutdownHooks([ShutdownSignal.SIGTERM]);

  // Apply compression to endpoints
  app.useLogger(logger);
  app.use(helmet(), compression());

  useContainer(app.select(ApiRioModule), { fallbackOnErrors: true });

  // Turn off the Swagger documentation in Production
  // if (sentry.environment !== 'aws-prod') {
  const docsLocation = `${rootLocation}/docs`;
  SwaggerModule.setup(docsLocation, app, document);
  logger.log(`Swagger docs setup at: ${docsLocation}`, 'Main');
  // }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  // Listen for requests
  await app.listen(httpPorts.apiRio);

  logger.log(
    `Rio API service is listening on port ${httpPorts.apiRio} ...`,
    'Main',
  );
}
configure();
bootstrap();

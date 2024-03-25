import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ENV } from '@/config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ENV.PORT);
}
bootstrap();

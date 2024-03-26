import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api';
import { ENV } from '@/config/shared-config.env';

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  await api.listen(ENV.PORT);
}
bootstrap();

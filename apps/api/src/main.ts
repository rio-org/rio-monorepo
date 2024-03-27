import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api';

const PORT = parseInt(process.env.PORT || '4000');

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  await api.listen(PORT);
}
bootstrap();

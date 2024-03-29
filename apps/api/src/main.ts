import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
// import { ApiModule } from './api';
import { AppModule } from './app.module';

const PORT = parseInt(process.env.PORT || '4000');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();

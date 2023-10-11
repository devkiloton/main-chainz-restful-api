import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { welcomeMessage } from './resources/helpers/welcome-message';
import { setupSwagger } from './resources/helpers/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  if (process.env['NODE_ENV'] === 'development') {
    app.enableCors();
  }
  setupSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env['PORT'] || 3000);
  welcomeMessage();
}
bootstrap();

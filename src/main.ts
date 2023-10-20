import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { welcomeMessage } from './resources/helpers/welcome-message';
import { setupSwagger } from './resources/helpers/setup-swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4000'],
  });
  setupSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env['PORT'] || 3000);
  welcomeMessage();
}
bootstrap();

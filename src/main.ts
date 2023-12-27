import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { welcomeMessage } from './resources/helpers/welcome-message';
import { setupSwagger } from './resources/helpers/setup-swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet for basic security
  app.use(helmet());

  // Setting up global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setting up origins that can access the API
  app.enableCors({
    origin: process.env['CLIENT_URL'],
  });

  // Swagger for API documentation
  setupSwagger(app);

  // Class validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Initiate app
  await app.listen(process.env['PORT'] || 3000);

  // Welcome message in the console
  welcomeMessage();
}
bootstrap();

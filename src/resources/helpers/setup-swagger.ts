import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle(`𝕮𝖊𝖓𝖙𝖗𝖆𝖑 𝕳𝖆𝖘𝖍 𝖆𝖕𝖎`)
    .setDescription(
      `
      ATTENTION!
      - This is a pre-alpha version of the Central Hash API.
      - This API is not stable and may change without notice.
      - Please, do not use it in production.

      USAGE:
      - To use authenticated routes in this API, you need to create an account.
      - After creating an account, you need to sign in to the system to generate an auth token.
      - Use the auth token in the authorization header to access the protected routes.
      `,
    )
    .setVersion('pre-alpha')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

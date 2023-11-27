import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getConfigDb = (isProduction: boolean, configService: ConfigService): TypeOrmModuleOptions => {
  if (isProduction) {
    return {
      type: 'mysql',
      url: configService.get<string>('DB_HOST'),
      ssl: {
        rejectUnauthorized: false,
      },
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
    };
  } else {
    return {
      type: 'mysql',
      host: configService.get<string>('LOCAL_DB_HOST'),
      username: configService.get<string>('LOCAL_DB_USERNAME'),
      password: configService.get<string>('LOCAL_DB_PASSWORD'),
      database: configService.get<string>('LOCAL_DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
};

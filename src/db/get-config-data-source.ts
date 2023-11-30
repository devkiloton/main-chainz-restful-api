import { DataSourceOptions } from 'typeorm';

export const getConfigDataSource = (): DataSourceOptions => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  if (isProduction) {
    return {
      type: 'mysql',
      url: process.env['DB_HOST'],
      ssl: {
        rejectUnauthorized: false,
      },
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
    };
  } else {
    return {
      type: 'mysql',
      host: process.env['LOCAL_DB_HOST'],
      username: process.env['LOCAL_DB_USERNAME'],
      password: process.env['LOCAL_DB_PASSWORD'],
      database: process.env['LOCAL_DB_DATABASE'],
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
};

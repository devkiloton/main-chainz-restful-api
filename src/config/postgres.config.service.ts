import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresService implements TypeOrmOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}
  createTypeOrmOptions(_connectionName?: string | undefined): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this._configService.get<string>('DB_HOST'),
      port: this._configService.get<number>('DB_PORT'),
      username: this._configService.get<string>('DB_USERNAME'),
      password: this._configService.get<string>('DB_PASSWORD'),
      database: this._configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}

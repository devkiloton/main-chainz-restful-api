import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getConfigDb } from './get-config-db';

@Injectable()
export class MySqlService implements TypeOrmOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}
  createTypeOrmOptions(_connectionName?: string | undefined): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const isProduction = this._configService.get<string>('NODE_ENV') === 'production';
    const config = getConfigDb(isProduction, this._configService);
    return config;
  }
}

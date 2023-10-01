import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { PostgresService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { AllExceptionsFilter } from './exception-filter/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresService,
      inject: [PostgresService],
    }),
    AuthModule,
    OrderModule,
  ],
  providers: [AllExceptionsFilter],
})
export class AppModule {}

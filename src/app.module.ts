import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassSerializerInterceptor, ConsoleLogger, Module } from '@nestjs/common';
import { PostgresService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { AllExceptionsFilter } from './resources/filters/exception-filter/all-exceptions.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalInterceptor } from './resources/interceptor/global.interceptor';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { FiatCurrenciesModule } from './modules/fiat-currencies/fiat-currencies.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 3600 * 1,
        limit: 1,
      },
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: PostgresService,
      inject: [PostgresService],
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          ttl: 3600 * 5,
        }),
      }),
      isGlobal: true,
    }),
    UserModule,
    OrderModule,
    AuthModule,
    CurrenciesModule,
    FiatCurrenciesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Hidding password from response with @Exclude()
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // Preventing brute force attacks
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    ConsoleLogger,
  ],
})
export class AppModule {}

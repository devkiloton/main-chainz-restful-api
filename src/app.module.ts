import { WalletsModule } from './modules/wallets/wallets.module';
import { EmailModule } from './modules/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassSerializerInterceptor, ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { AllExceptionsFilter } from './resources/filters/exception-filter/all-exceptions.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalInterceptor } from './resources/interceptor/global.interceptor';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { FiatCurrenciesModule } from './modules/fiat-currencies/fiat-currencies.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { ArticlesModule } from './modules/articles/articles.module';
import { MySqlService } from './config/mysql.config.service';
import { BitcoinModule } from './modules/bitcoin/bitcoin.module';

@Module({
  imports: [
    WalletsModule,
    EmailModule,
    MailerModule.forRootAsync({
      useFactory: async (_configService: ConfigService) => ({
        transport: {
          host: _configService.get('MAILER_HOST'),
          port: 465,
          secure: true,
          auth: {
            user: _configService.get('MAILER_USER'),
            pass: _configService.get('MAILER_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Improve throttling later
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 2,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: MySqlService,
      inject: [MySqlService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: 3600 * 5,
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    OrderModule,
    AuthModule,
    CurrenciesModule,
    FiatCurrenciesModule,
    ArticlesModule,
    BitcoinModule,
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

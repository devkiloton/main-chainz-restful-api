import { Module } from '@nestjs/common';
import { FiatCurrenciesService } from './fiat-currencies.service';
import { FiatCurrenciesController } from './fiat-currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiatCurrency } from './entities/fiat-currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FiatCurrency])],
  controllers: [FiatCurrenciesController],
  providers: [FiatCurrenciesService],
})
export class FiatCurrenciesModule {}

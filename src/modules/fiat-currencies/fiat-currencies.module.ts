import { Module } from '@nestjs/common';
import { FiatCurrenciesService } from './fiat-currencies.service';
import { FiatCurrenciesController } from './fiat-currencies.controller';

@Module({
  controllers: [FiatCurrenciesController],
  providers: [FiatCurrenciesService],
})
export class FiatCurrenciesModule {}

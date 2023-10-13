import { Controller, Get, Param } from '@nestjs/common';
import { FiatCurrenciesService } from './fiat-currencies.service';
import { ApiTags } from '@nestjs/swagger';
import { FiatCurrency } from './entities/fiat-currency.entity';

@ApiTags('/fiat-currencies')
@Controller('fiat-currencies')
export class FiatCurrenciesController {
  constructor(private readonly fiatCurrenciesService: FiatCurrenciesService) {}

  @Get()
  public async findAll(): Promise<FiatCurrency[]> {
    return this.fiatCurrenciesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<FiatCurrency> {
    return this.fiatCurrenciesService.findOne(id);
  }
}

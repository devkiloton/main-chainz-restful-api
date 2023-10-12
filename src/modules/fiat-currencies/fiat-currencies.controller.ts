import { Controller, Get, Param } from '@nestjs/common';
import { FiatCurrenciesService } from './fiat-currencies.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('/fiat-currencies')
@Controller('fiat-currencies')
export class FiatCurrenciesController {
  constructor(private readonly fiatCurrenciesService: FiatCurrenciesService) {}

  @Get()
  findAll() {
    return this.fiatCurrenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiatCurrenciesService.findOne(id);
  }
}

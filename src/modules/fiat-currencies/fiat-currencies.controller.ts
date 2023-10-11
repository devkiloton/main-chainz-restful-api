import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiatCurrenciesService } from './fiat-currencies.service';
import { CreateFiatCurrencyDto } from './dto/create-fiat-currency.dto';
import { UpdateFiatCurrencyDto } from './dto/update-fiat-currency.dto';

@Controller('fiat-currencies')
export class FiatCurrenciesController {
  constructor(private readonly fiatCurrenciesService: FiatCurrenciesService) {}

  @Post()
  create(@Body() createFiatCurrencyDto: CreateFiatCurrencyDto) {
    return this.fiatCurrenciesService.create(createFiatCurrencyDto);
  }

  @Get()
  findAll() {
    return this.fiatCurrenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiatCurrenciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiatCurrencyDto: UpdateFiatCurrencyDto) {
    return this.fiatCurrenciesService.update(+id, updateFiatCurrencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiatCurrenciesService.remove(+id);
  }
}

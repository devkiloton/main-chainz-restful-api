import { Controller, Get, Param } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ApiTags } from '@nestjs/swagger';
import { Currency } from './entities/currency.entity';

@ApiTags('/currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  public async findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }
}

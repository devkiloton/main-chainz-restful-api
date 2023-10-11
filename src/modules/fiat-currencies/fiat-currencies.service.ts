import { Injectable } from '@nestjs/common';
import { CreateFiatCurrencyDto } from './dto/create-fiat-currency.dto';
import { UpdateFiatCurrencyDto } from './dto/update-fiat-currency.dto';

@Injectable()
export class FiatCurrenciesService {
  create(createFiatCurrencyDto: CreateFiatCurrencyDto) {
    return 'This action adds a new fiatCurrency';
  }

  findAll() {
    return `This action returns all fiatCurrencies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiatCurrency`;
  }

  update(id: number, updateFiatCurrencyDto: UpdateFiatCurrencyDto) {
    return `This action updates a #${id} fiatCurrency`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiatCurrency`;
  }
}

import { Injectable } from '@nestjs/common';
import { UpdateFiatCurrencyDto } from './dto/update-fiat-currency.dto';
import { CreateFiatCurrencyDto } from './dto/create-fiat-currency.dto';

@Injectable()
export class FiatCurrenciesService {
  create(_createCurrencyDto: CreateFiatCurrencyDto) {
    return 'This action adds a new currency';
  }

  findAll() {
    return `This action returns all fiatCurrencies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiatCurrency`;
  }

  update(id: number, _updateCurrencyDto: UpdateFiatCurrencyDto) {
    return `This action updates a #${id} currency`;
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}

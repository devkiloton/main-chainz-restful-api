import { Injectable } from '@nestjs/common';

@Injectable()
export class FiatCurrenciesService {
  findAll() {
    return `This action returns all fiatCurrencies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiatCurrency`;
  }
}

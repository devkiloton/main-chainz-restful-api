import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFiatCurrencyDto } from './dto/update-fiat-currency.dto';
import { CreateFiatCurrencyDto } from './dto/create-fiat-currency.dto';
import { Repository } from 'typeorm';
import { FiatCurrency } from './entities/fiat-currency.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FiatCurrenciesService {
  constructor(@InjectRepository(FiatCurrency) private readonly _fiatCurrencyRepository: Repository<FiatCurrency>) {}

  async create(_createCurrencyDto: CreateFiatCurrencyDto): Promise<void> {
    const currency = new FiatCurrency();
    currency.id = _createCurrencyDto.id;
    currency.symbol = _createCurrencyDto.symbol;
    currency.rate = _createCurrencyDto.rate;
    await this._fiatCurrencyRepository.save(currency);
  }

  async findAll(): Promise<FiatCurrency[]> {
    return await this._fiatCurrencyRepository.find();
  }

  async findOne(id: string): Promise<FiatCurrency> {
    const options = { where: { id } };
    const possibleFiatCurrency = await this._fiatCurrencyRepository.findOne(options);
    if (!possibleFiatCurrency) {
      throw new NotFoundException('Fiat currency not found');
    }
    return possibleFiatCurrency;
  }

  async update(data: { id: string; updateCurrencyDto: UpdateFiatCurrencyDto }): Promise<void> {
    const currency = new FiatCurrency();
    currency.id = data.updateCurrencyDto.id;
    currency.symbol = data.updateCurrencyDto.symbol;
    currency.rate = data.updateCurrencyDto.rate;
    await this._fiatCurrencyRepository.update(data.id, currency);
  }

  async remove(id: string): Promise<void> {
    await this._fiatCurrencyRepository.delete(id);
  }
}

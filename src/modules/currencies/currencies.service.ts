import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(@InjectRepository(Currency) private readonly _currencyRepository: Repository<Currency>) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<void> {
    const currency = new Currency();
    currency.id = createCurrencyDto.id;
    currency.name = createCurrencyDto.name;
    currency.price = createCurrencyDto.price;
    currency.marketCap = createCurrencyDto.marketCap;
    currency.priceChange24h = createCurrencyDto.priceChange24h;

    await this._currencyRepository.save(currency);
  }

  async findAll(): Promise<Currency[]> {
    return await this._currencyRepository.find();
  }

  async findOne(id: string): Promise<Currency> {
    const options = { where: { id } };
    const possibleFiatCurrency = await this._currencyRepository.findOne(options);
    if (!possibleFiatCurrency) {
      throw new NotFoundException('Fiat currency not found');
    }
    return possibleFiatCurrency;
  }

  async update(data: { id: string; updateCurrencyDto: UpdateCurrencyDto }): Promise<void> {
    const currency = new Currency();
    currency.id = data.updateCurrencyDto.id;
    currency.name = data.updateCurrencyDto.name;
    currency.price = data.updateCurrencyDto.price;
    currency.marketCap = data.updateCurrencyDto.marketCap;
    currency.priceChange24h = data.updateCurrencyDto.priceChange24h;

    await this._currencyRepository.update(data.id, currency);
  }

  async remove(id: string): Promise<void> {
    await this._currencyRepository.delete(id);
  }
}

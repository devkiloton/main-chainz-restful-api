import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { ConfigService } from '@nestjs/config';
import fetch from 'cross-fetch';
import { formatNumber } from 'src/resources/helpers/unit-cutter';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);

  constructor(
    @InjectRepository(Currency) private readonly _currencyRepository: Repository<Currency>,
    private readonly _configService: ConfigService,
  ) {}

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
    // options to return descending marketCap column
    const options: FindManyOptions<Currency> = { order: { marketCap: 'DESC' } };
    return (await this._currencyRepository.find(options)).map(currency => ({
      ...currency,
      price: formatNumber(currency.price),
    }));
  }

  async findOne(id: string): Promise<Currency> {
    const options = { where: { id } };
    const possibleFiatCurrency = await this._currencyRepository.findOne(options);
    if (!possibleFiatCurrency) {
      throw new NotFoundException('Fiat currency not found');
    }
    return possibleFiatCurrency;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async update(): Promise<void> {
    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': this._configService.get('COINSTATS_API_KEY'),
      },
    };

    const coinstatsUrl = this._configService.get('COINSTATS_API_URL');

    const list = await fetch(coinstatsUrl + '/coins', options)
      .then(res => res.json())
      .then(
        json =>
          Object.values(json)[0] as Array<{
            name: string;
            price: number;
            symbol: string;
            marketCap: number;
            priceChange1d: number;
          }>,
      );
    // monero is not in the list of coins
    const monero = await fetch(coinstatsUrl + '/coins/monero', options);
    list.push(await monero.json());
    const newRows = list.map(crypto => {
      const currency = new Currency();
      currency.id = crypto.symbol;
      currency.name = crypto.name;
      currency.price = crypto.price;
      currency.marketCap = crypto.marketCap;
      currency.priceChange24h = crypto.priceChange1d;
      return { ...crypto, ...currency };
    });
    await this._currencyRepository.save(newRows);
    this.logger.log('Updating currencies');
  }

  async remove(id: string): Promise<void> {
    await this._currencyRepository.delete(id);
  }
}

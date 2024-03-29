import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FiatCurrency } from './entities/fiat-currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import fetch from 'cross-fetch';
@Injectable()
export class FiatCurrenciesService {
  private readonly logger = new Logger(FiatCurrenciesService.name);
  constructor(
    @InjectRepository(FiatCurrency) private readonly _fiatCurrencyRepository: Repository<FiatCurrency>,
    private readonly _configService: ConfigService,
  ) {}

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

  @Cron(CronExpression.EVERY_MINUTE)
  async update(): Promise<void> {
    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': this._configService.get('COINSTATS_API_KEY'),
      },
    };

    const list = await fetch(this._configService.get('COINSTATS_API_URL') + '/fiats', options)
      .then(res => res.json())
      .then(json => json as Array<{ name: string; rate: number; symbol: string }>);
    const newRows = list.map(fiat => {
      const fiatCurrency = new FiatCurrency();
      fiatCurrency.id = fiat.name;
      fiatCurrency.rate = fiat.rate;
      fiatCurrency.symbol = fiat.symbol;
      return { ...fiat, ...fiatCurrency };
    });
    await this._fiatCurrencyRepository.save(newRows);
    this.logger.log('Updating fiat currencies');
  }

  async remove(id: string): Promise<void> {
    await this._fiatCurrencyRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { SupportedCurrencies } from 'src/types/shared/supported-currencies';
import { encryption } from 'src/resources/helpers/shared/encryption';
import { isNil } from 'lodash';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity) private readonly _wallet: Repository<WalletEntity>,
    private readonly _user: UserService,
  ) {}

  async createWallet(data: { seed: string; currencyCode: SupportedCurrencies; userId: string }) {
    const user = await this._user.find(data.userId);
    const wallet = new WalletEntity();

    const encrypted = encryption(data.seed);
    wallet.seed = encrypted;
    wallet.currencyCode = data.currencyCode;
    wallet.user = user;
    return await this._wallet.save(wallet);
  }

  async getWallet(data: { userId: string; currencyCode: SupportedCurrencies }): Promise<WalletEntity> {
    const options: FindOneOptions = {
      where: {
        user: data.userId,
        currencyCode: data.currencyCode,
      },
    };
    const result = await this._wallet.findOne(options);
    if (isNil(result)) {
      throw new NotFoundException(`Wallet not found`);
    }
    return result;
  }
}

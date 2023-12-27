import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { SupportedCurrencies } from 'src/types/shared/supported-currencies';
import { encryption } from 'src/resources/helpers/shared/encryption';
import { isNull } from 'lodash';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity) private readonly _wallet: Repository<WalletEntity>,
    @InjectRepository(UserEntity) private readonly _user: Repository<UserEntity>,
  ) {}

  async createWallet(data: { seed: string; currencyCode: SupportedCurrencies; userId: string }) {
    const options: FindOneOptions = {
      where: {
        id: data.userId,
      },
    };
    const user = await this._user.findOne(options);
    if (isNull(user)) {
      throw new NotFoundException(`User not found`);
    }
    const wallet = new WalletEntity();

    const encrypted = encryption(data.seed);
    wallet.seed = encrypted;
    wallet.currencyCode = data.currencyCode;
    wallet.user = user;
    return await this._wallet.save(wallet);
  }
}

import { Injectable } from '@nestjs/common';
import * as bitcore from 'bitcore-lib';
import * as Mnemonic from 'bitcore-mnemonic';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UTXOs } from 'src/types/bitcoin/UTXOs';
import { Fees } from 'src/types/bitcoin/fees';
import { Balance } from 'src/types/bitcoin/balance';
import { mapUtxosFromAPI } from 'src/resources/helpers/bitcoin/map-utxos-from-api';
import { WalletsService } from '../wallets/wallets.service';
import { SupportedCurrencies } from 'src/types/shared/supported-currencies';
import { infoFromSeed } from 'src/resources/helpers/bitcoin/info-from-seed';
import { decryption } from 'src/resources/helpers/shared/decryption';
import { PublicWallet } from './types/public-wallet';
import { CreatedWallet } from './types/created-wallet';

@Injectable()
export class BitcoinService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _walletsService: WalletsService,
  ) {}
  async createWallet(data: { userId: string }): Promise<CreatedWallet> {
    const network = this._configService.get<'mainnet' | 'testnet'>('BITCOIN_NETWORK');
    const networkConfig = network === 'mainnet' ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
    const code = new Mnemonic();
    const infos = infoFromSeed({ code, network: networkConfig });
    await this._walletsService.createWallet({
      seed: code.phrase,
      currencyCode: SupportedCurrencies.btc,
      userId: data.userId,
    });
    return {
      seed: code.phrase,
      address: infos.address,
    };
  }

  async createTransaction(data: { receiver: string; satoshis: number; userId: string }) {
    const network = this._configService.get<'mainnet' | 'testnet'>('BITCOIN_NETWORK');
    const networkConfig = network === 'mainnet' ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
    const wallet = await this._walletsService.getWallet({ userId: data.userId, currencyCode: SupportedCurrencies.btc });
    const encryptedSeed = wallet.seed;
    const decryptedSeed = decryption(encryptedSeed);
    const code = new Mnemonic(decryptedSeed);
    const info = infoFromSeed({ code, network: networkConfig });
    const utxos: UTXOs = await axios
      .get(`${this._configService.get('BITCOIN_API')}/${network}/address/${info.address}/?unspent=true`)
      .then(res => res.data);
    const transaction = new bitcore.Transaction();
    const inputs: Array<bitcore.Transaction.UnspentOutput> = mapUtxosFromAPI({ utxos, network: networkConfig });
    transaction.from(inputs);
    const transactionSize = inputs.length * 180 + 2 * 34 + 10 - inputs.length;
    const fees: Fees = await axios.get(`${this._configService.get('BITCOIN_FEE_API')}`).then(res => res.data);
    const fee = fees.priority * transactionSize;

    const balance: Balance = await axios
      .get(`${this._configService.get('BITCOIN_API')}/${network}/address/${info.address}/balance`)
      .then(res => res.data);
    if (!(balance.balance >= data.satoshis + fee)) {
      throw new Error('Not enough balance');
    }
    transaction.fee(fee);
    transaction.to(data.receiver, data.satoshis);
    transaction.change(info.address);
    transaction.sign(info.privateKeyStr);
    const serializedTransaction = transaction.serialize();
    const transactionAPI: {
      txid: string;
    } = await axios({
      method: 'POST',
      url: `${this._configService.get('BITCOIN_API')}/${network}/tx/send`,
      data: {
        rawTx: serializedTransaction,
      },
    }).then(res => res.data);
    return transactionAPI.txid;
  }

  async findInformation(userId: string): Promise<PublicWallet> {
    const network = this._configService.get<'mainnet' | 'testnet'>('BITCOIN_NETWORK');
    const networkConfig = network === 'mainnet' ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
    const wallet = await this._walletsService.getWallet({ userId, currencyCode: SupportedCurrencies.btc });
    const decryptedSeed = decryption(wallet.seed);
    const code = new Mnemonic(decryptedSeed);
    const info = infoFromSeed({ code, network: networkConfig });
    const balance: Balance = await axios
      .get(`${this._configService.get('BITCOIN_API')}/${network}/address/${info.address}/balance`)
      .then(res => res.data);
    return {
      balance: balance.balance,
      address: info.address,
      unconfirmed: balance.unconfirmed,
      qrcode: `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=%20${info.address}&choe=UTF-8&chld=L|2`,
    };
  }
}

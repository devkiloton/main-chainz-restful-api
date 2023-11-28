import { Injectable } from '@nestjs/common';
import { UpdateBitcoinDto } from './dto/update-bitcoin.dto';
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

@Injectable()
export class BitcoinService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _walletsService: WalletsService,
  ) {}
  async transactionCycle() {
    const MOCKS = {
      sender: {
        seed: 'inflict organ reunion text donor patrol inject behind expire brief mushroom faith',
        pk: 'e48e7abd6fec81b3a16f7eaf7be2cc9c167a64c0c5f7284f981fbccdc38f71af',
        address: 'mj6cWAvwhn5bPhaCfrJVEV1r6PhfAb8nUa',
      },
      receiver: {
        address: 'n4ZBug3G18hzoX5CQVFA3VotphV4JANWLf',
      },
    };
    // * Seeting up the network
    const network = this._configService.get<'mainnet' | 'testnet'>('BITCOIN_NETWORK');
    const networkConfig = network === 'mainnet' ? bitcore.Networks.mainnet : bitcore.Networks.testnet;

    // * Creating wallet
    const code = new Mnemonic(MOCKS.sender.seed);
    const data = infoFromSeed({ code, network: networkConfig });
    MOCKS.sender.pk = new bitcore.PrivateKey(data.privateKeyStr, networkConfig).toWIF();
    MOCKS.sender.address = data.address;

    // * setting up amounts
    const amount = 5000; // 1 BTC

    // * output count
    const outputCount = 2;

    // * Fetching utxos
    const utxos: UTXOs = await axios
      .get(`${this._configService.get('BITCOIN_API')}/${network}/address/${MOCKS.sender.address}/?unspent=true`)
      .then(res => res.data);

    // * Creating transaction
    const transaction = new bitcore.Transaction();

    // * Creating inputs
    const inputs: Array<bitcore.Transaction.UnspentOutput> = mapUtxosFromAPI({ utxos, network: networkConfig });

    // * Adding inputs to transaction
    transaction.from(inputs);

    // * Calculating transaction size `UTXOs * 180bytes + outputCount * 34bytes + 10bytes - UTXOs`
    const transactionSize = inputs.length * 180 + outputCount * 34 + 10 - inputs.length;

    // * Fetching recommended fees
    const fees: Fees = await axios.get(`${this._configService.get('BITCOIN_FEE_API')}`).then(res => res.data);

    // * Checking balance
    const balance: Balance = await axios
      .get(`${this._configService.get('BITCOIN_API')}/${network}/address/${MOCKS.sender.address}/balance`)
      .then(res => res.data);

    // * Calculating transaction fee
    const fee = fees.priority * transactionSize;
    if (!(balance.balance >= amount + fee)) {
      throw new Error('Not enough balance');
    }
    transaction.fee(fee);

    // * Adding outputs
    transaction.to(MOCKS.receiver.address, amount);
    transaction.change(MOCKS.sender.address);

    // * Signing transaction
    transaction.sign(MOCKS.sender.pk);

    // * Serialize Transactions
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

    console.log('result', transactionAPI.txid);
  }

  async createWallet(data: { userId: string }) {
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
    // TODO: FETCH SEED FROM DB
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
    console.log(balance.balance, data.satoshis + fee);
    console.log(balance.balance >= data.satoshis + fee);
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

  findAll() {
    return `This action returns all bitcoin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bitcoin`;
  }

  update(id: number, _updateBitcoinDto: UpdateBitcoinDto) {
    return `This action updates a #${id} bitcoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} bitcoin`;
  }
}

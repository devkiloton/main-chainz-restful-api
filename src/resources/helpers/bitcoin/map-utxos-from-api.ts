import * as bitcore from 'bitcore-lib';
import { UTXO } from 'src/types/bitcoin/UTXOs';

export const mapUtxosFromAPI = (data: { utxos: any; network: bitcore.Networks.Network }) =>
  data.utxos.map((utxo: UTXO) => {
    const obj = {
      satoshis: utxo.value,
      script: new bitcore.Script(utxo.script),
      address: new bitcore.Address(utxo.address, data.network),
      txId: utxo.mintTxid,
      outputIndex: utxo.mintIndex,
    };
    return {
      ...obj,
      inspect: new bitcore.Transaction.UnspentOutput(obj).inspect,
      toObject: new bitcore.Transaction.UnspentOutput(obj).toObject,
    };
  });

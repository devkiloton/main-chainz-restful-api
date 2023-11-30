import * as bitcore from 'bitcore-lib';
import { UTXO } from 'src/types/bitcoin/UTXOs';

/**
 * Maps the `utxos` from the API to the `bitcore.Transaction.UnspentOutput` format.
 *
 * @param data - The `utxos` and `network` to map.
 * @returns The mapped `utxos` to the `bitcore.Transaction.UnspentOutput` format.
 */
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

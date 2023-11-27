// * Creting types
export type UTXOs = UTXO[];
export type UTXO = {
  _id: string;
  chain: string;
  network: string;
  coinbase: boolean;
  mintIndex: number;
  spentTxid: string;
  mintTxid: string;
  mintHeight: number;
  spentHeight: number;
  address: string;
  script: string;
  value: number;
  confirmations: number;
};

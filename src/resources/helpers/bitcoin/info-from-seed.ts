import * as bitcore from 'bitcore-lib';

export const infoFromSeed = (data: { code: any; network: bitcore.Networks.Network }) => {
  const xpriv = data.code.toHDPrivateKey(data.network);
  const derived = xpriv.derive("m/0'");
  const privateKey = derived.privateKey;
  const pk = new bitcore.PrivateKey(privateKey.toString(), data.network);

  const privateKeyStr = pk.toString();
  const publicKey = pk.publicKey;
  const publicKeyStr = publicKey.toString();
  const address = new bitcore.Address(publicKey, data.network);
  return {
    privateKeyStr: privateKeyStr,
    publicKeyStr: publicKeyStr,
    address: address.toString(),
  };
};

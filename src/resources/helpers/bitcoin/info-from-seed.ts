import * as bitcore from 'bitcore-lib';

/**
 * Gets the `privateKeyStr`, `publicKeyStr` and `address` of a seed.
 *
 * @param data - The `code` and `network` of the seed to get the information from.
 * @returns - The `privateKeyStr`, `publicKeyStr` and `address` of the seed.
 */
export const infoFromSeed = (data: { code: any; network: bitcore.Networks.Network }) => {
  // Create a HDPrivateKey from the seed.
  const xpriv = data.code.toHDPrivateKey(data.network);

  // Derive the first private key.
  const derived = xpriv.derive("m/0'");

  // Get the private key
  const privateKey = derived.privateKey;

  // Create a PrivateKey object from the private key.
  const pk = new bitcore.PrivateKey(privateKey.toString(), data.network);

  // Get the private key, from the PrivateKey object, as a string.
  const privateKeyStr = pk.toString();

  // Get the public key, from the PrivateKey object
  const publicKey = pk.publicKey;

  // Transform the public key to a string.
  const publicKeyStr = publicKey.toString();

  // Get the address of the public key.
  const address = new bitcore.Address(publicKey, data.network);
  return {
    privateKeyStr: privateKeyStr,
    publicKeyStr: publicKeyStr,
    address: address.toString(),
  };
};

import * as crypto from 'crypto';

/**
 * Encrypts a string using the ENCRYPTION_SECRET environment variable.
 *
 * @param plain - The string to encrypt.
 * @returns The encrypted string.
 * @throws `Error` - If the ENCRYPTION_SECRET environment variable is not set.
 */
export const encryption = (plain: string): string => {
  // The ENCRYPTION_SECRET environment variable is used as the key for the encryption.
  const ENCRYPTION_SECRET = process.env['ENCRYPTION_SECRET'];

  // The key is hashed using the SHA256 algorithm and then truncated to 32 bytes.
  let key = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest('hex').slice(0, 32);

  // If the ENCRYPTION_SECRET environment variable is not set, an error is thrown.
  if (!ENCRYPTION_SECRET) {
    throw new Error('Wallet entity creation failed');
  }

  // The algorithm used for the encryption is AES-256-CBC.
  const algorithm = 'aes-256-cbc';
  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);
  // create a cipher using the generated key and the initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, initVector);

  // encrypt the plain text
  let encryptedData = cipher.update(plain, 'utf-8', 'hex');

  // finalize the encryption process
  encryptedData += cipher.final('hex');

  // return the encrypted data
  const vectorString = initVector.toString('hex');

  // The encrypted data is returned in the following format: <initialization vector>:<encrypted data>
  const encrypted = `${vectorString}:${encryptedData}`;
  return encrypted;
};

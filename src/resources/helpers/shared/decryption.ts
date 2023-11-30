import * as crypto from 'crypto';

/**
 * Decrypts a string using the ENCRYPTION_SECRET environment variable.
 *
 * @param encrypted - The string to decrypt.
 * @returns The decrypted string.
 * @throws `Error` - If the encrypted string is not in the correct format.
 * @throws `Error` - If the ENCRYPTION_SECRET environment variable is not set.
 * @throws `Error` - If the initialization vector is not set.
 */
export const decryption = (encrypted: string): string => {
  // The ENCRYPTION_SECRET environment variable is used as the key for the encryption.
  const ENCRYPTION_SECRET = process.env['ENCRYPTION_SECRET'];

  // The key is hashed using the SHA256 algorithm and then truncated to 32 bytes.
  const algorithm = 'aes-256-cbc';
  let key = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest('hex').slice(0, 32);

  // If the ENCRYPTION_SECRET environment variable is not set, an error is thrown.
  if (!ENCRYPTION_SECRET) {
    throw new Error('Wallet entity creation failed');
  }

  // The encrypted data is in the following format: <initialization vector>:<encrypted data>
  const initVector = encrypted.split(':')[0];

  // If the initialization vector is not set, an error is thrown.
  if (!initVector) {
    throw new Error('Wallet entity decryption failed');
  }

  // The initialization vector is converted to a buffer.
  const buffer = Buffer.from(initVector, 'hex');

  // The encrypted data is decrypted.
  const decipher = crypto.createDecipheriv(algorithm, key, buffer);

  // The encrypted data is converted to a buffer.
  const data = encrypted.split(':')[1];

  // If the encrypted data is not set, an error is thrown.
  if (!data) {
    throw new Error('Wallet entity decryption failed');
  }

  // The encrypted data is decrypted.
  let decryptedData = decipher.update(data, 'hex', 'utf-8');

  // The decrypted data is finalized.
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

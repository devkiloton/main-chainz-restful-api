import * as crypto from 'crypto';
// TODO: CHANGE THIS TO THE CORRECT DECRYPTION FUNCTION
export const decryption = (encrypted: string): string => {
  const ENCRYPTION_SECRET = process.env['ENCRYPTION_SECRET'];
  const algorithm = 'aes-256-cbc';
  let key = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest('hex').slice(0, 32);
  if (!ENCRYPTION_SECRET) {
    throw new Error('Wallet entity creation failed');
  }
  const initVector = encrypted.split(':')[0];
  if (!initVector) {
    throw new Error('Wallet entity decryption failed');
  }
  const buffer = Buffer.from(initVector, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, buffer);
  const data = encrypted.split(':')[1];
  if (!data) {
    throw new Error('Wallet entity decryption failed');
  }

  let decryptedData = decipher.update(data, 'hex', 'utf-8');

  decryptedData += decipher.final('utf8');
  return decryptedData;
};

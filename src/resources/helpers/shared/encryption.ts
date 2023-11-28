import * as crypto from 'crypto';
// TODO: CHANGE THIS TO THE CORRECT ENCRYPTION FUNCTION
export const encryption = (plain: string): string => {
  const ENCRYPTION_SECRET = process.env['ENCRYPTION_SECRET'];
  let key = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest('hex').slice(0, 32);
  if (!ENCRYPTION_SECRET) {
    throw new Error('Wallet entity creation failed');
  }
  const algorithm = 'aes-256-cbc';
  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);
  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, key, initVector);

  let encryptedData = cipher.update(plain, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  const vectorString = initVector.toString('hex');
  const encrypted = `${vectorString}:${encryptedData}`;
  return encrypted;
};

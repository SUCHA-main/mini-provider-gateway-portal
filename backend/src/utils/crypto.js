import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';

export function generateConsumerKey() {
  const random = randomBytes(24).toString('hex');
  return `mpg_${random}`;
}

export function hashKey(key) {
  return createHash('sha256').update(key).digest('hex');
}

export function verifyHash(key, hash) {
  const keyHash = hashKey(key);
  if (keyHash.length !== hash.length) return false;
  return timingSafeEqual(Buffer.from(keyHash), Buffer.from(hash));
}

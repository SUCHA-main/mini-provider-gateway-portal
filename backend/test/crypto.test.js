import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateConsumerKey, hashKey, verifyHash } from '../src/utils/crypto.js';

describe('crypto utils', () => {
  it('generateConsumerKey returns key with mpg_ prefix', () => {
    const key = generateConsumerKey();
    assert.ok(key.startsWith('mpg_'), 'Key should start with mpg_');
    assert.ok(key.length > 10, 'Key should be long enough');
  });

  it('hashKey returns consistent hash', () => {
    const key = 'test-key-123';
    const hash1 = hashKey(key);
    const hash2 = hashKey(key);
    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64, 'SHA-256 hash should be 64 hex chars');
  });

  it('verifyHash returns true for matching key', () => {
    const key = generateConsumerKey();
    const hash = hashKey(key);
    assert.strictEqual(verifyHash(key, hash), true);
  });

  it('verifyHash returns false for wrong key', () => {
    const key = generateConsumerKey();
    const hash = hashKey(key);
    assert.strictEqual(verifyHash('wrong-key', hash), false);
  });

  it('generateConsumerKey generates unique keys', () => {
    const keys = new Set();
    for (let i = 0; i < 100; i++) {
      keys.add(generateConsumerKey());
    }
    assert.strictEqual(keys.size, 100, 'All keys should be unique');
  });
});

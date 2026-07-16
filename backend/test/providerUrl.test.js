import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildProviderUrl } from '../src/providers/openaiCompatibleAdapter.js';

describe('openai-compatible URL building', () => {
  it('appends /chat/completions when base ends with /v1', () => {
    const url = buildProviderUrl('https://api.example.com/v1');
    assert.strictEqual(url, 'https://api.example.com/v1/chat/completions');
  });

  it('appends /v1/chat/completions when base does not end with /v1', () => {
    const url = buildProviderUrl('https://api.example.com');
    assert.strictEqual(url, 'https://api.example.com/v1/chat/completions');
  });

  it('handles base with trailing slash', () => {
    const url = buildProviderUrl('https://api.example.com/');
    assert.strictEqual(url, 'https://api.example.com/v1/chat/completions');
  });

  it('handles localhost URL', () => {
    const url = buildProviderUrl('http://127.0.0.1:11434');
    assert.strictEqual(url, 'http://127.0.0.1:11434/v1/chat/completions');
  });

  it('handles xiaomi mimo style URL', () => {
    const url = buildProviderUrl('https://api.xiaomimimo.com/v1');
    assert.strictEqual(url, 'https://api.xiaomimimo.com/v1/chat/completions');
  });
});

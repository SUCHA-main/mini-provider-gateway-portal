import { getDb } from '../db.js';
import { maskApiKey } from '../utils/mask.js';
import { callProvider } from '../providers/openaiCompatibleAdapter.js';
import { callOllama } from '../providers/ollamaAdapter.js';
import config from '../config.js';

function maskRow(row) {
  if (!row) return null;
  const { api_key, ...rest } = row;
  return { ...rest, api_key_masked: maskApiKey(api_key) };
}

export function getAll() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM providers ORDER BY id DESC').all();
  return rows.map(maskRow);
}

export function getById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM providers WHERE id = ?').get(id) || null;
}

export function getEnabled() {
  const db = getDb();
  return db.prepare('SELECT * FROM providers WHERE enabled = 1').all();
}

export function create(data) {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO providers (name, type, base_url, api_key, default_model, enabled, timeout_ms, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const enabled = data.enabled !== undefined ? (data.enabled ? 1 : 0) : 1;
  const timeoutMs = data.timeout_ms || config.defaultTimeoutMs;
  const result = stmt.run(
    data.name, data.type, data.base_url, data.api_key || null,
    data.default_model || null, enabled, timeoutMs, now, now
  );
  return maskRow(getById(result.lastInsertRowid));
}

export function update(id, data) {
  const db = getDb();
  const existing = getById(id);
  const fields = [];
  const values = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.type !== undefined) { fields.push('type = ?'); values.push(data.type); }
  if (data.base_url !== undefined) { fields.push('base_url = ?'); values.push(data.base_url); }
  if (data.api_key !== undefined) { fields.push('api_key = ?'); values.push(data.api_key); }
  if (data.default_model !== undefined) { fields.push('default_model = ?'); values.push(data.default_model); }
  if (data.enabled !== undefined) { fields.push('enabled = ?'); values.push(data.enabled ? 1 : 0); }
  if (data.timeout_ms !== undefined) { fields.push('timeout_ms = ?'); values.push(data.timeout_ms); }

  if (fields.length === 0) return maskRow(existing);

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE providers SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return maskRow(getById(id));
}

export function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM providers WHERE id = ?').run(id);
}

export async function test(provider) {
  const testMessages = [{ role: 'user', content: 'Say "test ok" in 3 words or less.' }];
  const start = Date.now();
  let result;
  if (provider.type === 'ollama') {
    result = await callOllama(provider, { model: provider.default_model, messages: testMessages });
  } else {
    result = await callProvider(provider, { model: provider.default_model, messages: testMessages });
  }
  const latency = Date.now() - start;
  const content = result.choices?.[0]?.message?.content || '';
  return { ok: true, latency_ms: latency, response_preview: content.slice(0, 200) };
}

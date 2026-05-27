import { getDb } from '../db.js';
import { generateConsumerKey, hashKey } from '../utils/crypto.js';

function sanitize(row) {
  if (!row) return null;
  const { key_hash, ...rest } = row;
  return rest;
}

export function getAll() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM consumers ORDER BY id DESC').all();
  return rows.map(sanitize);
}

export function getById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM consumers WHERE id = ?').get(id) || null;
}

export function create(data) {
  const db = getDb();
  const apiKey = generateConsumerKey();
  const keyHash = hashKey(apiKey);
  const keyPrefix = apiKey.slice(0, 7);
  const now = new Date().toISOString();
  const allowedProviderIds = data.allowed_provider_ids ? JSON.stringify(data.allowed_provider_ids) : null;
  const rateLimit = data.rate_limit_per_min || 60;

  const stmt = db.prepare(`
    INSERT INTO consumers (name, key_hash, key_prefix, enabled, allowed_provider_ids, rate_limit_per_min, created_at, updated_at)
    VALUES (?, ?, ?, 1, ?, ?, ?, ?)
  `);
  const result = stmt.run(data.name, keyHash, keyPrefix, allowedProviderIds, rateLimit, now, now);
  const consumer = getById(result.lastInsertRowid);
  return { consumer: sanitize(consumer), api_key: apiKey };
}

export function update(id, data) {
  const db = getDb();
  const fields = [];
  const values = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.enabled !== undefined) { fields.push('enabled = ?'); values.push(data.enabled ? 1 : 0); }
  if (data.allowed_provider_ids !== undefined) { fields.push('allowed_provider_ids = ?'); values.push(JSON.stringify(data.allowed_provider_ids)); }
  if (data.rate_limit_per_min !== undefined) { fields.push('rate_limit_per_min = ?'); values.push(data.rate_limit_per_min); }

  if (fields.length === 0) return sanitize(getById(id));

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE consumers SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return sanitize(getById(id));
}

export function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM consumers WHERE id = ?').run(id);
}

export function rotateKey(id) {
  const db = getDb();
  const apiKey = generateConsumerKey();
  const keyHash = hashKey(apiKey);
  const keyPrefix = apiKey.slice(0, 7);
  db.prepare("UPDATE consumers SET key_hash = ?, key_prefix = ?, updated_at = datetime('now') WHERE id = ?").run(keyHash, keyPrefix, id);
  const consumer = getById(id);
  return { consumer: sanitize(consumer), api_key: apiKey };
}

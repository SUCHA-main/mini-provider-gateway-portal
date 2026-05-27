import { getDb } from '../db.js';

export function create(data) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO call_logs (request_id, consumer_id, provider_id, provider_type, model, route, status, http_status, latency_ms, input_tokens, output_tokens, total_tokens, error_code, error_message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.request_id, data.consumer_id || null, data.provider_id || null,
    data.provider_type || null, data.model || null, data.route || null,
    data.status, data.http_status || null, data.latency_ms || null,
    data.input_tokens || null, data.output_tokens || null, data.total_tokens || null,
    data.error_code || null, data.error_message || null
  );
}

export function getAll(limit = 50, filters = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM call_logs WHERE 1=1';
  const params = [];

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.provider_id) {
    sql += ' AND provider_id = ?';
    params.push(filters.provider_id);
  }
  if (filters.consumer_id) {
    sql += ' AND consumer_id = ?';
    params.push(filters.consumer_id);
  }

  sql += ' ORDER BY id DESC LIMIT ?';
  params.push(limit);

  return db.prepare(sql).all(...params);
}

import { DatabaseSync } from 'node:sqlite';
import config from './config.js';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

let db;

export function getDb() {
  if (!db) {
    const dbDir = dirname(config.databasePath);
    mkdirSync(dbDir, { recursive: true });
    db = new DatabaseSync(config.databasePath);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('openai_compatible', 'ollama')),
      base_url TEXT NOT NULL,
      api_key TEXT,
      default_model TEXT,
      enabled INTEGER DEFAULT 1,
      timeout_ms INTEGER DEFAULT 60000,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS consumers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      allowed_provider_ids TEXT,
      rate_limit_per_min INTEGER DEFAULT 60,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      last_used_at TEXT
    );

    CREATE TABLE IF NOT EXISTS call_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      consumer_id INTEGER,
      provider_id INTEGER,
      provider_type TEXT,
      model TEXT,
      route TEXT,
      status TEXT CHECK(status IN ('success', 'error')),
      http_status INTEGER,
      latency_ms INTEGER,
      input_tokens INTEGER,
      output_tokens INTEGER,
      total_tokens INTEGER,
      error_code TEXT,
      error_message TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

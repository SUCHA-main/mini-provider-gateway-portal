import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '3100', 10),
  databasePath: process.env.DATABASE_PATH || './data/app.db',
  adminToken: process.env.ADMIN_TOKEN || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5176',
  defaultTimeoutMs: parseInt(process.env.DEFAULT_TIMEOUT_MS || '60000', 10),
};

export default config;

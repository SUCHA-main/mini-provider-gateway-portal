import { getDb } from '../db.js';
import { verifyHash } from '../utils/crypto.js';

export function consumerAuth(req, res, next) {
  let key = req.headers['x-consumer-key'];
  if (!key) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      key = authHeader.slice(7);
    }
  }
  if (!key) {
    return res.status(401).json({ error: { message: 'Missing consumer key', type: 'auth_error' } });
  }

  const db = getDb();
  const consumers = db.prepare('SELECT * FROM consumers WHERE enabled = 1').all();

  let matchedConsumer = null;
  for (const consumer of consumers) {
    if (verifyHash(key, consumer.key_hash)) {
      matchedConsumer = consumer;
      break;
    }
  }

  if (!matchedConsumer) {
    return res.status(401).json({ error: { message: 'Invalid consumer key', type: 'auth_error' } });
  }

  db.prepare('UPDATE consumers SET last_used_at = datetime(\'now\') WHERE id = ?').run(matchedConsumer.id);

  req.consumer = matchedConsumer;
  next();
}

import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  let dbStatus = 'ok';
  try {
    getDb().prepare('SELECT 1').get();
  } catch {
    dbStatus = 'error';
  }
  res.json({
    ok: dbStatus === 'ok',
    service: 'mini-provider-gateway-portal',
    time: new Date().toISOString(),
    db: dbStatus,
  });
});

export default router;

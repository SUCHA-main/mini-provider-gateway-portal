import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import * as logService from '../services/logService.js';

const router = Router();
router.use(adminAuth);

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit || '50', 10);
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.provider_id) filters.provider_id = parseInt(req.query.provider_id, 10);
  if (req.query.consumer_id) filters.consumer_id = parseInt(req.query.consumer_id, 10);
  const logs = logService.getAll(limit, filters);
  res.json(logs);
});

export default router;

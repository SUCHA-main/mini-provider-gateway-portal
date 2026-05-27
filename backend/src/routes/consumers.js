import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import * as consumerService from '../services/consumerService.js';

const router = Router();
router.use(adminAuth);

router.get('/', (req, res) => {
  const consumers = consumerService.getAll();
  res.json(consumers);
});

router.post('/', (req, res) => {
  const { name, allowed_provider_ids, rate_limit_per_min } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const result = consumerService.create({ name, allowed_provider_ids, rate_limit_per_min });
  res.status(201).json(result);
});

router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = consumerService.getById(id);
  if (!existing) return res.status(404).json({ error: 'Consumer not found' });
  const updated = consumerService.update(id, req.body);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = consumerService.getById(id);
  if (!existing) return res.status(404).json({ error: 'Consumer not found' });
  consumerService.remove(id);
  res.json({ deleted: true, id });
});

router.post('/:id/rotate-key', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = consumerService.getById(id);
  if (!existing) return res.status(404).json({ error: 'Consumer not found' });
  const result = consumerService.rotateKey(id);
  res.json(result);
});

export default router;

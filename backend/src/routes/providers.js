import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import * as providerService from '../services/providerService.js';

const router = Router();
router.use(adminAuth);

router.get('/', (req, res) => {
  const providers = providerService.getAll();
  res.json(providers);
});

router.post('/', (req, res) => {
  const { name, type, base_url, api_key, default_model, enabled, timeout_ms } = req.body;
  if (!name || !type || !base_url) {
    return res.status(400).json({ error: 'name, type, base_url are required' });
  }
  if (!['openai_compatible', 'ollama'].includes(type)) {
    return res.status(400).json({ error: 'type must be openai_compatible or ollama' });
  }
  const provider = providerService.create({ name, type, base_url, api_key, default_model, enabled, timeout_ms });
  res.status(201).json(provider);
});

router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = providerService.getById(id);
  if (!existing) return res.status(404).json({ error: 'Provider not found' });
  const updated = providerService.update(id, req.body);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = providerService.getById(id);
  if (!existing) return res.status(404).json({ error: 'Provider not found' });
  providerService.remove(id);
  res.json({ deleted: true, id });
});

router.post('/:id/test', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const provider = providerService.getById(id);
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  try {
    const result = await providerService.test(provider);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;

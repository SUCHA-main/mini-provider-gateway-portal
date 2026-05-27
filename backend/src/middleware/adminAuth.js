import config from '../config.js';

export function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== config.adminToken) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing x-admin-token' });
  }
  next();
}

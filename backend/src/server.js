import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './config.js';
import { getDb } from './db.js';
import healthRouter from './routes/health.js';
import providersRouter from './routes/providers.js';
import consumersRouter from './routes/consumers.js';
import logsRouter from './routes/logs.js';
import proxyRouter from './routes/proxy.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDist = resolve(__dirname, '../../frontend/dist');

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

getDb();

app.use('/api/health', healthRouter);
app.use('/api/providers', providersRouter);
app.use('/api/consumers', consumersRouter);
app.use('/api/logs', logsRouter);
app.use('/', proxyRouter);

if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/v1/') || req.path.startsWith('/proxy/')) {
      return next();
    }
    return res.sendFile(resolve(frontendDist, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Mini Provider Gateway Portal backend running on http://localhost:${config.port}`);
});

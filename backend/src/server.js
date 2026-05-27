import express from 'express';
import cors from 'cors';
import config from './config.js';
import { getDb } from './db.js';
import healthRouter from './routes/health.js';
import providersRouter from './routes/providers.js';
import consumersRouter from './routes/consumers.js';
import logsRouter from './routes/logs.js';
import proxyRouter from './routes/proxy.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

getDb();

app.use('/api/health', healthRouter);
app.use('/api/providers', providersRouter);
app.use('/api/consumers', consumersRouter);
app.use('/api/logs', logsRouter);
app.use('/', proxyRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Mini Provider Gateway Portal backend running on http://localhost:${config.port}`);
});

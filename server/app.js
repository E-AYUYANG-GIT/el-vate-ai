import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import generateRoutes from './routes/generate.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(generalLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/generate', generateRoutes);

// Must be registered after all routes.
app.use(errorHandler);

export default app;

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

import logger from './middlewares/logger.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import productosRouter from './routes/productos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const origenesPermitidos = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:4173')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origenesPermitidos,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

app.use(logger);
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({ message: 'HermanosJota E-commerce API' });
});

app.use('/api/productos', productosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
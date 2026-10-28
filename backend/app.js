const path = require('path');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const productosRouter = require('./routes/productos');

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

module.exports = app;
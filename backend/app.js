// Configura y exporta la app de Express. No escucha en ningún puerto: eso
// lo hace server.js. Separar ambas cosas permite importar la app en tests
// sin levantar un servidor.
const path = require('path');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const productosRouter = require('./routes/productos');

const app = express();

// CORS: el frontend corre en otro origen, y sin Access-Control-Allow-Origin el
// navegador descarta la respuesta antes de que el JS la pueda leer. No se usa
// cors() pelado porque dejaría la API abierta a cualquier sitio; se declaran
// los orígenes permitidos, configurables con CORS_ORIGIN. Incluye 5174 y 4173
// porque si el 5173 está ocupado Vite sube al siguiente puerto.
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

// Archivos estáticos: lo que está en public/catalogo/x.webp se pide como
// GET /catalogo/x.webp. Va antes del 404 para que las imágenes no caigan en
// ese handler. Se usa __dirname y no una ruta relativa porque el directorio
// de trabajo cambia según desde dónde se levante el servidor.
app.use(express.static(path.join(__dirname, 'public')));

// Health check.
app.get('/', (req, res) => {
  res.json({ message: 'HermanosJota E-commerce API' });
});

app.use('/api/productos', productosRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
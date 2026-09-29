// ============================================================
// Capa de rutas.
// Cada archivo de rutas define las URLs de un recurso y las
// asocia a los controllers. El router se monta después en el
// servidor con app.use('/api/productos', productosRouter).
// ============================================================

const express = require('express');
const { getProductos, getProductoPorId } = require('../controllers/productosController');

const router = express.Router(); // Mini app de rutas: permite modularizar por recurso

// B7 - GET /api/productos -> lista todos los productos
// La ruta se define como '/' porque el prefijo /api/productos ya
// lo agrega el app.use() del server.js. El orden importa: '/' va
// primero y '/:id' al final, así Express no interpreta un id como
// si fuera otra cosa.
router.get('/', getProductos);

// B8 - GET /api/productos/:id -> detalle de un producto
router.get('/:id', getProductoPorId);

module.exports = router;

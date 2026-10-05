// Rutas del recurso productos. Solo asocian URLs con controllers: la lógica
// de la respuesta vive en controllers/productosController.js.
const express = require('express');
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const { getProductos, getProductoPorId } = require('../controllers/productosController');

const router = express.Router();

// El prefijo /api/productos lo agrega el app.use() de app.js, por eso la ruta
// se define como '/'. El orden importa: '/' va antes que '/:id'.
router.get('/', getProductos);
router.get('/:id', getProductoPorId);

// Cualquier otro método sobre estas mismas rutas (POST, PUT, DELETE...) devuelve
// 405 en vez de 404. Se declaran después de los GET porque Express usa la
// primera coincidencia.
router.all('/', methodNotAllowed);
router.all('/:id', methodNotAllowed);

module.exports = router;
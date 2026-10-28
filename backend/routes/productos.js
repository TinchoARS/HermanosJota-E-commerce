const express = require('express');
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const { getProductos, getProductoPorId } = require('../controllers/productosController');

const router = express.Router();

router.get('/', getProductos);
router.get('/:id', getProductoPorId);

router.all('/', methodNotAllowed);
router.all('/:id', methodNotAllowed);

module.exports = router;
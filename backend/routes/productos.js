import express from 'express';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import { getProductos, getProductoPorId, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/productosController.js';

const router = express.Router();

router.get('/', getProductos);
router.post('/', crearProducto);
router.get('/:id', getProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

router.all('/', methodNotAllowed(['GET', 'POST']));
router.all('/:id', methodNotAllowed(['GET', 'PUT', 'DELETE']));

export default router;
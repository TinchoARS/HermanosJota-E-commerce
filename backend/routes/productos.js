import express from 'express';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import { getProductos, getProductoPorId } from '../controllers/productosController.js';

const router = express.Router();

router.get('/', getProductos);
router.get('/:id', getProductoPorId);

router.all('/', methodNotAllowed);
router.all('/:id', methodNotAllowed);

export default router;
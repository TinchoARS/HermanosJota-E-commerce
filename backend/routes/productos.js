import express from 'express';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import { getProductos, getProductoPorId } from '../controllers/productosController.js';

const router = express.Router();

router.get('/', getProductos);
router.get('/:id', getProductoPorId);

router.all('/', methodNotAllowed(['GET']));
router.all('/:id', methodNotAllowed(['GET']));

export default router;
import express from 'express';
import verificarToken from '../middlewares/verificarToken.js';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import { crearPedido, getMisPedidos } from '../controllers/pedidosController.js';

const router = express.Router();

router.post('/', verificarToken, crearPedido);
router.get('/mios', verificarToken, getMisPedidos);

router.all('/', methodNotAllowed(['POST']));
router.all('/mios', methodNotAllowed(['GET']));

export default router;

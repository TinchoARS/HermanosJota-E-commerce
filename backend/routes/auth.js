import express from 'express';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import verificarToken from '../middlewares/verificarToken.js';
import { registro, login, obtenerPerfil } from '../controllers/authController.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', verificarToken, obtenerPerfil);

router.all('/registro', methodNotAllowed(['POST']));
router.all('/login', methodNotAllowed(['POST']));
router.all('/perfil', methodNotAllowed(['GET']));

export default router;
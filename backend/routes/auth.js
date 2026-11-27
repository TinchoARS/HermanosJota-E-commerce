import express from 'express';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import { registro, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);

router.all('/registro', methodNotAllowed(['POST']));
router.all('/login', methodNotAllowed(['POST']));

export default router;
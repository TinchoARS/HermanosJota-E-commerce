import express from 'express';
import methodNotAllowed from '../middlewares/methodNotAllowed.js';
import { registro } from '../controllers/authController.js';

const router = express.Router();

router.post('/registro', registro);
router.all('/registro', methodNotAllowed(['POST']));

export default router;

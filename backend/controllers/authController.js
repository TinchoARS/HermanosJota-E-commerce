import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function registro(req, res) {
  const { nombre, email, password } = req.body ?? {};

  const detalles = {};
  if (email !== undefined && typeof email !== 'string') {
    detalles.email = 'El email debe ser un texto';
  }
  if (password !== undefined && typeof password !== 'string') {
    detalles.password = 'La contraseña debe ser un texto';
  }
  if (Object.keys(detalles).length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles });
  }

  const usuario = new User({ nombre, email, password });
  await usuario.validate();

  usuario.password = await bcrypt.hash(password, 10);
  await usuario.save();

  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '6d',
  });

  res.status(201).json({ token, usuario });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: { credenciales: 'Email y contraseña requeridos' },
    });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
  });

  res.status(200).json({ token, usuario: user.toJSON() });
}

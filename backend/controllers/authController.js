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

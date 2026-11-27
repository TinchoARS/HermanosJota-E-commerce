// Borra lo que deja la colección de Postman: los usuarios prueba-<número>@example.com, sus pedidos
// y la "Mesa de Prueba" si una corrida se cortó antes de eliminarla.
import 'dotenv/config';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const EMAIL_DE_PRUEBA = /^prueba-\d+@example\.com$/;

const limpiar = async () => {
  await connectDB();

  const usuarios = await User.find({ email: EMAIL_DE_PRUEBA }, '_id');
  const ids = usuarios.map((usuario) => usuario._id);

  const pedidos = await Order.deleteMany({ usuario: { $in: ids } });
  const borrados = await User.deleteMany({ _id: { $in: ids } });
  const productos = await Product.deleteMany({ nombre: 'Mesa de Prueba' });

  console.log(
    `Se borraron ${borrados.deletedCount} usuarios, ${pedidos.deletedCount} pedidos y ${productos.deletedCount} productos de prueba`
  );

  await mongoose.disconnect();
};

limpiar().catch(async (error) => {
  console.error('Error al limpiar los datos de prueba:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});

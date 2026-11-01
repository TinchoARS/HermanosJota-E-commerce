import 'dotenv/config';
import mongoose from 'mongoose';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import productos from '../data/productos.js';

const STOCK_INICIAL = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_PRODUCTOS = path.join(__dirname, '..', 'data', 'productos.js');

const transformarProducto = ({ nombre, descripcion, precio, imagen }) => ({
  nombre,
  descripcion,
  precio,
  stock: STOCK_INICIAL,
  imagenUrl: imagen,
});

const seed = async () => {
  await connectDB();

  const productosTransformados = productos.map(transformarProducto);

  await Product.deleteMany({});
  const productosInsertados = await Product.insertMany(productosTransformados);
  console.log(`Se cargaron ${productosInsertados.length} productos`);

  await unlink(RUTA_PRODUCTOS);
  console.log('Se elimino data/productos.js');

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Error al ejecutar el seed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});

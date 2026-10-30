import mongoose from 'mongoose';
import Product from '../models/Product.js';

const CAMPOS = ['nombre', 'descripcion', 'precio', 'stock', 'imagenUrl'];

const datosDelBody = (body) => {
  const entrada = body ?? {};
  const datos = {};

  for (const campo of CAMPOS) {
    if (entrada[campo] !== undefined) datos[campo] = entrada[campo];
  }

  return datos;
};

export async function getProductos(req, res) {
  res.json(await Product.find());
}

export async function crearProducto(req, res) {
  const producto = await Product.create(datosDelBody(req.body));
  res.status(201).json(producto);
}

export async function actualizarProducto(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Id inválido' });
  }

  const producto = await Product.findByIdAndUpdate(id, datosDelBody(req.body), {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
}

export async function getProductoPorId(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Id inválido' });
  }

  const producto = await Product.findById(id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
}
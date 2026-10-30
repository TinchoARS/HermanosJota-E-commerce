import mongoose from 'mongoose';
import Product from '../models/Product.js';

export async function getProductos(req, res) {
  res.json(await Product.find());
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
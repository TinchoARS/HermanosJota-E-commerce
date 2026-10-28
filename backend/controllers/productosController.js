import productos from '../data/productos.js';

export function getProductos(req, res) {
  res.json(productos);
}

export function getProductoPorId(req, res) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: `El id "${id}" no es válido` });
  }

  const producto = productos.find((item) => item.id === Number(id));

  if (!producto) {
    return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
  }

  res.json(producto);
}
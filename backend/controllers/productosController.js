// Lógica de cada endpoint del recurso productos, separada de las rutas.
const productos = require('../data/productos');

function getProductos(req, res) {
  res.json(productos);
}

// Express deja :id en req.params siempre como string. Se valida que sean solo
// dígitos porque Number() acepta cosas como "0x2" o "2.0" y las convertiría en 2,
// de modo que /api/productos/0x2 devolvería el producto 2.
function getProductoPorId(req, res) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: `El id "${id}" no es válido` });
  }

  const producto = productos.find((item) => item.id === Number(id));

  // El return es obligatorio: sin él la función seguiría y Express intentaría
  // enviar una segunda respuesta ("Cannot set headers after sent").
  if (!producto) {
    return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
  }

  res.json(producto);
}

module.exports = { getProductos, getProductoPorId };
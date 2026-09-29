// ============================================================
// Capa de controladores.
// Un controller agrupa la lógica de negocio de un recurso y la
// separa de las rutas: las rutas solo se encargan de qué función se
// ejecuta ante cada URL, sin saber cómo se resuelve la respuesta.
// Cada handler recibe (req, res) y responde explícitamente.
// ============================================================

const productos = require('../data/productos'); // B3: array con los 11 productos

// ------------------------------------------------------------
// B6 - GET /api/productos -> devuelve TODOS los productos
// res.json() serializa el array a JSON y la pone en el body con
// status 200 implícito.
// ------------------------------------------------------------
function getProductos(req, res) {
  res.json(productos);
}

// ------------------------------------------------------------
// B8 - GET /api/productos/:id -> devuelve UN producto por id
// :id es un parámetro de ruta: Express lo deja en req.params.id
// (siempre string, por eso se convierte con Number antes de
// comparar contra los id numéricos del array).
// Si no hay coincidencia se corta la función con return y se
// responde 404 en JSON; si se omite el return, la respuesta
// seguiría adelante y daría "Cannot set headers after sent".
// ------------------------------------------------------------
function getProductoPorId(req, res) {
  const { id } = req.params;
  const producto = productos.find((item) => item.id === Number(id));

  if (!producto) {
    return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
  }

  res.json(producto);
}

// Se exportan ambas funciones para que routes/productos.js las importe.
module.exports = { getProductos, getProductoPorId };

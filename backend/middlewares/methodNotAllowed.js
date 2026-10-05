// Para rutas que existen pero no aceptan el método pedido, como POST en
// /api/productos. HTTP pide 405 y la cabecera Allow, no 404: el recurso sí
// existe, lo que no existe es la operación.
module.exports = (req, res) => {
  res.set('Allow', 'GET');
  res.status(405).json({ error: `Método ${req.method} no permitido en esta ruta` });
};
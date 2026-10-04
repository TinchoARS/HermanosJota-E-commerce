// Se registra después de todas las rutas: si ninguna coincidió, cae acá.
// Responde en JSON para que el cliente siempre reciba el mismo formato.
module.exports = (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};
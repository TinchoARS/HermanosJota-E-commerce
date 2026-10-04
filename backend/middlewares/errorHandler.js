// Express reconoce un manejador de errores por tener 4 parámetros: el `next`
// vacío es obligatorio aunque no se use. Va al final, después de las rutas.
module.exports = (err, req, res, next) => {
  console.error(err);

  // express.json() marca con 400 los bodies mal formados. Ese error es del
  // cliente, no del servidor, así que se respeta su status en vez de forzar 500.
  const status = err.status || err.statusCode || 500;
  if (status >= 400 && status < 500) {
    return res.status(status).json({ error: 'Petición inválida' });
  }

  // El error real nunca se devuelve al cliente: solo se loguea arriba.
  res.status(500).json({ error: 'Error interno del servidor' });
};
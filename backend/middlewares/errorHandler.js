module.exports = (err, req, res, next) => {
  console.error(err);

  const status = err.status || err.statusCode || 500;
  if (status >= 400 && status < 500) {
    const mensaje = err.expose ? err.message : 'Petición inválida';
    return res.status(status).json({ error: mensaje });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};

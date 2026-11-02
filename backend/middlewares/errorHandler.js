const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const detalles = Object.fromEntries(
      Object.values(err.errors).map(({ path, message }) => [path, message])
    );
    return res.status(400).json({ error: 'Datos inválidos', detalles });
  }

  if (err.name === 'CastError') {
    const mensaje = err.path === '_id' ? 'Id inválido' : `Valor inválido para ${err.path}`;
    return res.status(400).json({ error: mensaje });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 400 && status < 500) {
    const mensaje = err.expose ? err.message : 'Petición inválida';
    return res.status(status).json({ error: mensaje });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};

export default errorHandler;

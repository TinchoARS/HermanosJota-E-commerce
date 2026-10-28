const methodNotAllowed = (req, res) => {
  res.set('Allow', 'GET');
  res.status(405).json({ error: `Método ${req.method} no permitido en esta ruta` });
};

export default methodNotAllowed;
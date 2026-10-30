const methodNotAllowed = (metodos) => (req, res) => {
  res.set('Allow', metodos.join(', '));
  res.status(405).json({ error: 'Método no permitido' });
};

export default methodNotAllowed;
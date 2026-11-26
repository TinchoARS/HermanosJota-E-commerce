import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado, token no proporcionado' });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ error: 'No autorizado, token inválido o expirado' });
  }
};

export default verificarToken;

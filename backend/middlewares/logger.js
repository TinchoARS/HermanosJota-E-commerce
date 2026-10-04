// Log global: registra método y URL de cada petición que entra a la API.
module.exports = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
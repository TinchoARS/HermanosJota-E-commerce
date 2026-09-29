// ============================================================
// Punto de entrada del backend.
// Acá se arma la app de Express: se registran los middlewares
// globales, se montan las rutas y se define el puerto de escucha.
// ============================================================

const express = require('express');
const productosRouter = require('./routes/productos'); // B7: router con los endpoints de productos

const app = express();
const PORT = process.env.PORT || 3000; // B2: usa el puerto del entorno (render, docker, etc.) o 3000 por defecto

// ------------------------------------------------------------
// B4 - MIDDLEWARE GLOBAL DE LOGGING
// app.use() sin ruta se ejecuta en TODAS las peticiones, sin
// importar cuál sea. Se registra el método y la URL, se llama a
// next() para que la petición siga hacia la siguiente capa.
// originalUrl incluye el query string (ej: /api/productos?limite=5)
// ------------------------------------------------------------
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ------------------------------------------------------------
// B5 - MIDDLEWARE DE PARSEO DE JSON
// express.json() convierte el body de las peticiones a objeto
// JavaScript. Sin esto, req.body vendría vacío en un POST.
// Tiene un límite por defecto de 100kb de body.
// ------------------------------------------------------------
app.use(express.json());

// ------------------------------------------------------------
// Ruta raíz: sirve de health check para verificar que la API está
// viva (útil para deploys). No forma parte de las tareas B1-B10.
// ------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'HermanosJota E-commerce API' });
});

// ------------------------------------------------------------
// B7 - MONTAJE DE LAS RUTAS
// Todo lo que exporta routes/productos.js queda bajo el prefijo
// /api/productos. Ej: router.get('/') responde en /api/productos
// ------------------------------------------------------------
app.use('/api/productos', productosRouter);

// ------------------------------------------------------------
// B9 - HANDLER 404 (ruta no encontrada)
// Va DESPUÉS de las rutas: si ninguna coincidió, cae acá.
// Se responde en JSON para que el cliente siempre reciba el mismo
// formato. En Express los errores se manejan con status + json().
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ------------------------------------------------------------
// B10 - MANEJADOR DE ERRORES CENTRALIZADO (500)
// Express identifica un error de middleware por tener 4 parámetros
// (err, req, res, next), aunque no se use next: por eso el next
// vacío es obligatorio y no se puede borrar.
// Primero se loguea el error real (que nunca se le devuelve al
// cliente por seguridad) y después se responde un 500 genérico.
// Debe ir al final, después de todas las rutas.
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ------------------------------------------------------------
// Arranca el servidor. El callback se ejecuta una vez que el
// puerto ya está escuchando, así recién ahí tiene sentido loguear
// la URL. process.env.PORT se lee en la línea de arriba.
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

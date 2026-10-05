// Punto de entrada: levanta el servidor. La configuración de Express vive
// en app.js.
const app = require('./app');

// Puerto 3000 por decisión del grupo, siguiendo la recomendación de la
// profesora. El frontend lo levanta Vite en el 5173, así que no se pisan.
// Se puede cambiar con PORT=4000 npm run dev (y ahí VITE_API_URL del .env
// tiene que apuntar al puerto nuevo).
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
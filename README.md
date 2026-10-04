# 🛋️ E-commerce Mueblería Hermanos Jota

Sitio web de e-commerce para una mueblería, desarrollado como proyecto grupal de la facultad. Permite navegar un catálogo de muebles, ver el detalle de cada producto, agregarlos a un carrito de compras simulado y contactar a la tienda mediante un formulario.

A diferencia de la primera versión del proyecto, los datos ya no viven en un array dentro del navegador: el frontend es una aplicación React que consume una API REST propia, con el catálogo servido desde el backend.

---

## 📋 Descripción del proyecto

El proyecto está dividido en dos partes:

- **`backend/`** — API REST con Express. Expone el catálogo de productos, sirve las imágenes del catálogo como archivos estáticos y centraliza el manejo de errores. Los datos están en un array de objetos JavaScript que cumple el mismo papel que cumpliría una base de datos.
- **`client/`** — aplicación React (Vite) de una sola página. Se conecta a la API, muestra el catálogo, el detalle de cada producto y el carrito.

La API expone el catálogo y lo consume el frontend con `fetch` a través de hooks propios que manejan los estados de carga, error y vacío.

---

## 👥 Integrantes

| Nombre | Rol / Parte del proyecto |
| :--- | :--- |
| Gaston Guber | API base: inicialización de Express, endpoints de productos y estructura de carpetas |
| Martin Fradejas Soria | Catálogo: `ProductCard`, `ProductList`, hook `useProductos`, conexión con la API y correcciones del backend |
| Cristian Benjamin Cerioni | Frontend: creación de la app con Vite, estilos base y variables del manual de marca, `Navbar`, `Footer`, `ContactForm` y URL de la API |

---

## ✨ Funcionalidades

**Frontend**

- **Navbar:** logo, navegación (Inicio, Catálogo, Contacto) y botón de carrito con el contador de productos agregados.
- **Catálogo de productos:** grilla de tarjetas con imagen, nombre y precio en formato ARS. Incluye estados de carga (spinner), de error con botón "Reintentar" y de lista vacía.
- **Detalle de producto:** imagen grande, nombre, descripción completa y precio, con los botones "Agregar al carrito" y "Volver al catálogo". El producto se pide a la API por id y maneja el 404 mostrando "Producto no encontrado".
- **Carrito de compras:** contador visible en el navbar, manejado con estado de React. Es una simulación: no hay persistencia ni checkout.
- **Formulario de contacto:** formulario controlado, validación simple de campos obligatorios, mensaje de éxito y limpieza al enviar.
- **Footer:** datos de contacto, redes sociales y copyright.

**Backend**

- **API REST** con `GET /api/productos` y `GET /api/productos/:id`.
- **CORS** configurado con una lista de orígenes permitidos, para que el frontend pueda consultar la API desde otro puerto.
- **Archivos estáticos:** las imágenes del catálogo se sirven desde `/catalogo`.
- **Logging global** de cada petición (método y URL), en un middleware propio.
- **Middlewares separados** de la configuración, en `middlewares/`: logger, 404, errores y 405.
- **Manejo de errores:** respuesta 404 en JSON para rutas inexistentes, 405 para métodos no soportados y 500 para errores internos, en un manejador centralizado.

---

## 🛠️ Tecnologías utilizadas

**Backend**

- Node.js
- Express 5
- `cors` — habilitado para el origen del frontend
- `nodemon` — reinicio automático en desarrollo
- CommonJS (`require` / `module.exports`)

**Frontend**

- React 19
- Vite 8 — bundler y servidor de desarrollo
- `oxlint` — linter
- CSS3 — custom properties en `:root`, Flexbox y Grid, diseño responsivo
- Google Fonts (Inter + Playfair Display)

---

## 📁 Estructura del proyecto

```
HermanosJota-E-commerce/
├── backend/
│   ├── app.js                     # Configura y exporta la app de Express
│   ├── server.js                  # Punto de entrada: solo hace listen()
│   ├── middlewares/
│   │   ├── logger.js              # Log global de peticiones
│   │   ├── notFound.js            # 404 para rutas inexistentes
│   │   ├── errorHandler.js        # Manejador central de errores
│   │   └── methodNotAllowed.js    # 405 para métodos no soportados
│   ├── controllers/
│   │   └── productosController.js # Lógica de los endpoints de productos
│   ├── routes/
│   │   └── productos.js           # Rutas del recurso productos
│   ├── data/
│   │   └── productos.js           # Catálogo hardcodeado (11 productos)
│   ├── public/
│   │   └── catalogo/              # Imágenes servidas como archivos estáticos
│   └── package.json
│
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example               # Plantilla de configuración
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                # Renderizado condicional y estado del carrito
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductDetail.jsx
│   │   ├── hooks/
│   │   │   ├── useProductos.js    # GET /api/productos
│   │   │   └── useProducto.js     # GET /api/productos/:id
│   │   └── styles/
│   │       ├── style.css          # Variables, navbar, footer y contacto
│   │       ├── catalogo.css       # Grilla y estados del catálogo
│   │       └── producto-detalle.css
│   └── package.json
│
└── README.md
```

### Separación entre `app.js` y `server.js`

`app.js` arma y exporta la app de Express (CORS, middlewares, rutas, manejo de errores) pero **no escucha en ningún puerto**. `server.js` la importa y llama a `app.listen()`. Así la app se puede importar en un test sin levantar un servidor de verdad.

---

## 🔌 Endpoints de la API

Base: `http://localhost:3000`

| Método | Ruta | Descripción | Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | `200` — mensaje de la API |
| `GET` | `/api/productos` | Lista todos los productos | `200` — array con los 11 productos |
| `GET` | `/api/productos/:id` | Detalle de un producto | `200` — objeto · `400` — id no numérico · `404` — no existe |
| `GET` | `/catalogo/:imagen` | Imagen del catálogo (archivo estático) | `200` — `image/png` |

Sobre `/api/productos` solo se admite `GET`. Cualquier otro método (`POST`, `PUT`, `PATCH`, `DELETE`) responde `405 Method Not Allowed` con la cabecera `Allow: GET`, en lugar de un 404: el recurso existe, lo que no existe es la operación. Las rutas que no corresponden a ningún recurso devuelven `404` con `{"error": "Ruta no encontrada"}`, y los errores internos `500` con `{"error": "Error interno del servidor"}`.

Ejemplos con `curl`:

```bash
curl http://localhost:3000/api/productos
curl http://localhost:3000/api/productos/1
curl -i http://localhost:3000/api/productos/999          # 404
curl -i -X POST http://localhost:3000/api/productos      # 405
```

---

## ⚙️ Configuración

**Variables de entorno del backend** (opcionales, con valor por defecto):

| Variable | Default | Descripción |
| :--- | :--- | :--- |
| `PORT` | `3000` | Puerto en el que escucha la API (ver [Sobre los puertos](#sobre-los-puertos)) |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:5174,http://localhost:4173` | Orígenes permitidos del **frontend**, separados por coma |

**Variables de entorno del frontend:**

| Variable | Default | Descripción |
| :--- | :--- | :--- |
| `VITE_API_URL` | — | URL base de la API. **Obligatoria**: sin ella el frontend busca los datos en su propio origen |

`client/.env` está en el `.gitignore`, así que **cada_integrante tiene que crear el suyo**:

```bash
cp client/.env.example client/.env
```

Si cambiás el puerto del backend, tenés que actualizar `VITE_API_URL` en el frontend para que apunte al puerto nuevo.

### Sobre los puertos

El backend escucha en el **3000** y el frontend en el **5173**, así que no hay choque entre los dos.

Esa separación no es casual: el proyecto usaba Create React App, que por defecto levanta el frontend en el 3000, igual que el backend. Eso sí era un conflicto. La migración a **Vite** (cuyo puerto por defecto es 5173) lo resolvió, por lo que hoy ambos servicios conviven sin problema.

El puerto **3000 se mantiene por decisión conjunta del grupo, siguiendo la recomendación de la profesora** en la clase. Se evaluaron también el 8080 y el 3001, pero el 3000 es la convención de Node/Express y el que se indicó desde el curso, así que no se cambió.

Ningún puerto está fijado a fuego: ambos son configurables.

```bash
# Backend en otro puerto
PORT=4000 npm run dev
```

```bash
# Frontend: ajustar en client/.env para que apunte al puerto nuevo
VITE_API_URL=http://localhost:4000
```

> Si el 5173 estuviera ocupado, Vite sube solo al 5174 (no tiene `strictPort`) y ese origen ya está permitido en `CORS_ORIGIN`.

---

## 💻 Cómo correrlo localmente

**Requisito previo:** Node.js 18 o superior (probado en Node 24).

Cloná el repositorio:

```bash
git clone https://github.com/TinchoARS/HermanosJota-E-commerce.git
cd HermanosJota-E-commerce
```

### 1. Backend

```bash
cd backend
npm install
npm run dev        # o: npm start
```

Queda escuchando en `http://localhost:3000`.

### 2. Frontend

En **otra terminal**:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Queda disponible en `http://localhost:5173`.

> Necesitás las dos terminales corriendo a la vez: el frontend no tiene los productos adentro, los pide a la API en cada carga.

---

## 🌐 Ver el sitio en vivo

_Pendiente de despliegue._

---

## 🔀 Flujo de trabajo

El equipo trabaja con ramas propias a partir de `develop`, siguiendo el formato `nombre/TituloCambios`. Los cambios se integran mediante Pull Requests hacia `develop`, donde `main` recibe las versiones estables.
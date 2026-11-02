# 🛋️ E-commerce Mueblería Hermanos Jota

Sitio web de e-commerce para una mueblería, desarrollado como proyecto grupal del curso Full Stack Developer (ITBA). Permite navegar un catálogo de muebles, ver el detalle de cada producto, agregarlos a un carrito de compras simulado, contactar a la tienda y administrar el catálogo: crear, editar y eliminar productos.

El frontend es una aplicación React con React Router que consume una API REST propia hecha con Express. Desde el Sprint 6 los productos viven en una base de datos **MongoDB Atlas**, a la que la API accede con **Mongoose**.

---

## 🌐 Sitio online

**👉 [hermanosjota-ecommerce-zeta.vercel.app](https://hermanosjota-ecommerce-zeta.vercel.app/)**

| Parte | URL |
| :--- | :--- |
| Frontend | https://hermanosjota-ecommerce-zeta.vercel.app/ |
| API | https://hermanosjota-api-livid.vercel.app/api/productos |

Los dos están deployados en Vercel como proyectos separados: el frontend como sitio estático de Vite y la API como función de Express. El frontend sabe dónde está la API por la variable `VITE_API_URL`, y la API acepta pedidos del frontend porque su dominio está en `CORS_ORIGIN`. Los detalles están en [Deploy](#-deploy).

---

## 📋 Descripción del proyecto

El proyecto está dividido en dos partes:

- **`backend/`** — API REST con Express y Mongoose. Expone el CRUD completo de productos sobre MongoDB Atlas, sirve las imágenes del catálogo como archivos estáticos y centraliza el manejo de errores.
- **`client/`** — aplicación React (Vite) de una sola página, con React Router. Muestra el catálogo, el detalle de cada producto, el carrito, el formulario de contacto y las pantallas para crear y editar productos.

El frontend no tiene productos propios: los pide a la API con `fetch`, centralizado en `services/api.js`, y los muestra con hooks que manejan los estados de carga, error y vacío.

---

## 🧭 Decisiones tomadas

- **API propia con Express y MongoDB Atlas.** En el Sprint 4 los productos estaban en un array de JavaScript; en el Sprint 6 pasaron a una base de datos real, con un esquema de Mongoose que valida los datos antes de guardarlos.
- **Contrato del producto acordado entre los cuatro.** Cada producto tiene `_id`, `nombre`, `descripcion`, `precio`, `stock` e `imagenUrl`. Se pasó del `id` numérico al `_id` de Mongo (un string) y de `imagen` a `imagenUrl`, y se cambió en todo el front a la vez: carrito, detalle, links y keys.
- **Vite en lugar de Create React App.** La consigna menciona CRA, pero CRA levanta el frontend en el 3000, igual que el backend, y eso genera un conflicto de puertos. Vite usa el 5173 y ambos conviven. El listado de mejoras del curso también lo propone.
- **Puerto 3000 para la API**, por decisión del grupo siguiendo la recomendación de la profesora. También se evaluaron el 8080 y el 3001.
- **CORS con lista de orígenes permitidos** en lugar de `cors()` abierto: el frontend puede consultar la API, pero otras páginas que el usuario tenga abiertas en el navegador no.
- **Imágenes servidas por el backend** desde `public/catalogo`, y no desde el frontend, para que todo el catálogo viva en un solo lado. En la base se guarda la ruta relativa (`catalogo/sofa-patagonia.webp`) y el front le agrega la URL de la API; si la ruta empieza con `http`, se usa tal cual, así un producto nuevo puede tener una imagen externa.
- **Imágenes en WebP.** Las originales eran PNG de 1024×1024 y sumaban casi 6 MB. Se pasaron a WebP de 800×800, que pesan unos 50 KB cada una (589 KB en total), así el catálogo carga rápido también en el celular.
- **React Router con un `Layout` común.** Navbar, Footer y el aviso del carrito están en `Layout`, y cada página se renderiza en su `<Outlet>`. Cada vista tiene su URL (`/productos/:id`, `/contacto`), así los links se pueden compartir y el botón "atrás" funciona. Al volver atrás se recupera la posición de scroll.
- **Catálogo, carrito y filtros en el `Layout`.** Viven arriba de las páginas y se comparten por el contexto del `Outlet`, así el carrito es global y la búsqueda y el orden del catálogo no se pierden al entrar a un detalle y volver.
- **Carrito simulado, con persistencia en el navegador.** Se guarda en `localStorage` por `_id`, así sobrevive a una recarga. No hay backend de carritos ni de pedidos: "Finalizar compra" vacía el carrito y muestra un agradecimiento. No deja agregar más unidades que el stock disponible.
- **Mensajes de error pensados para el usuario.** `services/api.js` conserva el código de estado y el detalle por campo que devuelve la API, y el front lo traduce: "Revisá el precio y el stock e intentá de nuevo." en un 400 o "El producto ya no existe o fue eliminado." en un 404.
- **Edición de productos en `/admin/editar-producto/:id`.** La consigna no la pide, pero sin ella el `PUT` de la API no se usaría desde la interfaz. El alta y la edición comparten el mismo formulario.
- **Seed para la carga inicial.** Los 11 productos del catálogo original se cargan en la base con un script (`npm run seed`). Se borró `data/productos.js`, como pide la consigna, y los datos iniciales quedaron dentro del propio script, así el seed se puede volver a correr si hace falta restaurar el catálogo.
- **Carrito en el centro del header y con la palabra "Carrito" al lado del ícono.** Fue una decisión del grupo a partir de las correcciones de la primera entrega: el ícono quedaba aislado en el extremo derecho y se leía como un detalle menor. Centrado en la barra y con texto al lado, el carrito pasa a ser una sección más de la tienda.
- **Imagen en el home.** El home arrancaba solo con texto. Se agregó un banner con una imagen y un botón de "Ver catálogo", con el objetivo de darle mayor impacto al usuario en la primera impresión. La imagen se importa como módulo desde React y se le pasa al CSS como variable, para que el degradado que garantiza el contraste del texto quede en la hoja de estilos.

---

## 👥 Integrantes

| Nombre | Sprint 4 | Sprint 6 |
| :--- | :--- | :--- |
| Gastón Guber | API en Express (endpoints, rutas modulares y middlewares), CORS, imágenes servidas desde el backend y `README` | Conexión a MongoDB Atlas y variables de entorno, esquema `Product`, seed del catálogo y rediseño de Contacto |
| Martin Fradejas Soria | Catálogo de productos: `ProductCard`, `ProductList`, hook `useProductos` y el detalle | React Router (`Layout`, páginas y rutas), `services/api.js`, rewrite de Vercel, mensajes de error y tope de stock en el carrito |
| Cristian Benjamin Cerioni Lanzilotta | Base del frontend con Vite, estilos y variables del manual de marca, `Navbar`, `Footer` y `ContactForm` | Formulario de alta, URL de las imágenes, botón Eliminar, stock en la interfaz, página 404 e integración con la API |
| Diego Garcia | — | CRUD de la API con Mongoose (`GET` por id, `POST`, `PUT` y `DELETE`), errores de Mongoose en el `errorHandler` y colección de Postman |

---

## ✨ Funcionalidades

**Frontend**

- **Navbar:** logo, navegación (Inicio, Catálogo, Contacto) y botón de carrito en el centro de la barra, con ícono, la palabra "Carrito" y el contador de productos agregados. Queda fijo arriba al scrollear y suma una sombra suave para separarse del contenido. En tablet y celular se acomoda en dos filas.
- **Inicio:** banner de bienvenida con imagen, título y botón "Ver catálogo", y el catálogo debajo.
- **Catálogo de productos (`/productos`):** grilla de tarjetas con imagen, nombre, precio en formato ARS y stock (dos columnas en el celular). Tiene buscador por nombre (sin importar mayúsculas ni tildes: "cordoba" encuentra "Sillas Córdoba"), orden por precio o por nombre y contador de resultados. Incluye estados de carga (spinner), de error con botón "Reintentar", de lista vacía y de búsqueda sin resultados.
- **Detalle de producto (`/productos/:id`):** miga de pan, imagen grande, nombre, descripción, precio, stock y selector de cantidad, con los botones "Agregar al carrito", "Volver al catálogo", "Editar" y "Eliminar". Aparece al instante con los datos que ya trajo el catálogo y se actualiza con `GET /api/productos/:id`. Si el producto no existe muestra "Producto no encontrado", y si la dirección tiene un id mal formado, "Producto no válido".
- **Alta y edición de productos (`/admin/crear-producto` y `/admin/editar-producto/:id`):** formulario controlado con validación en el cliente (nombre y precio obligatorios, precio y stock no negativos, stock entero). Mientras se guarda, el botón se deshabilita; si la API responde con error, lo muestra arriba del botón. Al terminar vuelve al catálogo o al detalle, ya actualizados. El alta no tiene link en el menú: se entra escribiendo la dirección.
- **Eliminar producto:** pide confirmación, lo borra con `DELETE`, lo saca del carrito y vuelve al catálogo. Si falla, muestra el error en la página.
- **Carrito de compras:** contador en el navbar y panel desplegable con cada producto, su cantidad (con botones + y −), el botón "Quitar", el total y "Finalizar compra" (simulado). Se cierra con Escape o al hacer clic afuera. Se guarda en `localStorage`, así no se pierde al recargar. Al agregar aparece un aviso flotante que se oculta solo. Cuando el carrito ya tiene todo el stock de un producto, los botones para sumar se deshabilitan y se avisa "Ya tenés todo el stock en el carrito".
- **Contacto (`/contacto`):** formulario controlado con validación propia: campos obligatorios (no acepta solo espacios) y formato de email, con el error debajo de cada campo. Al fallar la validación, el foco va al primer campo a corregir. Al enviar muestra un mensaje de éxito que se borra solo al minuto, al volver a escribir o al cambiar de pestaña. Al lado tiene un panel con los datos del showroom, WhatsApp y email.
- **Página 404:** cualquier dirección que no existe muestra "Página no encontrada" con un link al inicio.
- **Footer:** datos de contacto y redes con íconos SVG. Todos son links: la dirección abre Google Maps, el WhatsApp abre el chat y el email abre el correo.
- **Vista previa al compartir:** `meta description` y etiquetas Open Graph, así el link muestra título, descripción e imagen en WhatsApp y redes.

**Backend**

- **API REST con CRUD completo** de productos sobre MongoDB Atlas.
- **Validación con Mongoose:** nombre y precio obligatorios, precio y stock no negativos. El `PUT` también valida (`runValidators`).
- **Solo se guardan los campos del modelo:** lo que llegue en el body fuera de `nombre`, `descripcion`, `precio`, `stock` e `imagenUrl` (por ejemplo `_id` o `createdAt`) se ignora.
- **CORS** configurado con una lista de orígenes permitidos, para que el frontend pueda consultar la API desde otro dominio.
- **Archivos estáticos:** las imágenes del catálogo se sirven desde `/catalogo`.
- **Logging global** de cada petición (método y URL), en un middleware propio.
- **Middlewares separados** de la configuración, en `middlewares/`: logger, conexión a la base, 404, errores y 405.
- **Conexión a MongoDB reutilizable:** `server.js` se conecta antes de escuchar, y en Vercel, donde la entrada es `app.js`, el middleware de `/api` abre la conexión en el primer pedido y la reusa en los siguientes.
- **Manejo de errores centralizado:** `400` con el detalle de cada campo cuando los datos no son válidos, `400` para ids mal formados y JSON roto, `404` para productos y rutas inexistentes, `405` para métodos no soportados y `500` para errores internos, siempre en JSON.

---

## 🛠️ Tecnologías utilizadas

**Backend**

- Node.js
- Express 5
- MongoDB Atlas + Mongoose 9
- `dotenv` — variables de entorno
- `cors` — habilitado para el origen del frontend
- `nodemon` — reinicio automático en desarrollo
- ES Modules (`import` / `export`)

**Frontend**

- React 19
- React Router 7
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
│   ├── server.js                  # Punto de entrada: conecta a MongoDB y después hace listen()
│   ├── .env                       # Variables de entorno (no se sube al repo)
│   ├── config/
│   │   └── db.js                  # Conexión a MongoDB Atlas con Mongoose
│   ├── models/
│   │   └── Product.js             # Esquema del producto
│   ├── controllers/
│   │   └── productosController.js # CRUD de productos
│   ├── routes/
│   │   └── productos.js           # Rutas del recurso productos
│   ├── middlewares/
│   │   ├── logger.js              # Log global de peticiones
│   │   ├── conectarDB.js          # Espera la conexión a MongoDB antes de atender /api
│   │   ├── notFound.js            # 404 para rutas inexistentes
│   │   ├── errorHandler.js        # Manejador central de errores
│   │   └── methodNotAllowed.js    # 405 para métodos no soportados
│   ├── scripts/
│   │   └── seed.js                # Carga inicial del catálogo (npm run seed)
│   ├── postman/
│   │   └── jota-api.postman_collection.json
│   ├── public/
│   │   └── catalogo/              # Imágenes (WebP) servidas como archivos estáticos
│   └── package.json
│
├── client/
│   ├── index.html                 # Incluye la meta description y las etiquetas Open Graph
│   ├── vite.config.js
│   ├── vercel.json                # Rewrite de SPA: toda ruta sirve index.html
│   ├── .env                       # URL de la API (VITE_API_URL)
│   ├── public/
│   │   └── og-image.jpg           # Imagen de la vista previa al compartir el link
│   ├── src/
│   │   ├── main.jsx               # Monta la app dentro de BrowserRouter
│   │   ├── App.jsx                # Declara las rutas
│   │   ├── assets/
│   │   │   ├── logo.svg
│   │   │   └── hero.webp          # Imagen del banner
│   │   ├── pages/
│   │   │   ├── InicioPage.jsx
│   │   │   ├── CatalogoPage.jsx
│   │   │   ├── DetallePage.jsx
│   │   │   ├── ContactoPage.jsx
│   │   │   ├── CrearProductoPage.jsx
│   │   │   ├── EditarProductoPage.jsx
│   │   │   └── NoEncontradoPage.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Navbar + Outlet + Footer; catálogo y carrito globales
│   │   │   ├── Navbar.jsx
│   │   │   ├── CarritoPanel.jsx   # Panel desplegable del carrito
│   │   │   ├── Hero.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ProductForm.jsx    # Formulario de alta y edición
│   │   │   ├── AvisoCarrito.jsx   # Aviso flotante "se agregó al carrito"
│   │   │   └── ScrollAlNavegar.jsx # Scroll arriba al navegar y posición guardada al volver
│   │   ├── config/
│   │   │   └── api.js             # URL base de la API
│   │   ├── services/
│   │   │   └── api.js             # Todos los fetch a la API y la URL de las imágenes
│   │   ├── hooks/
│   │   │   ├── useProductos.js    # Estado del catálogo
│   │   │   ├── useProducto.js     # Estado del detalle
│   │   │   └── useCarrito.js      # Estado del carrito (persistido) y del aviso
│   │   ├── utils/
│   │   │   ├── formatPrice.js     # Formato de precio en pesos
│   │   │   ├── mensajeError.js    # Traduce los errores de la API a mensajes para el usuario
│   │   │   └── textoStock.js      # Texto del stock según lo que ya hay en el carrito
│   │   └── styles/
│   │       ├── style.css          # Variables, navbar, hero, aviso, footer y contacto
│   │       ├── catalogo.css       # Grilla y estados del catálogo
│   │       ├── producto-detalle.css
│   │       └── admin.css          # Formularios de alta y edición
│   └── package.json
│
└── README.md
```

---

## 🔌 Endpoints de la API

Base local: `http://localhost:3000` · En producción: `https://hermanosjota-api-livid.vercel.app`

| Método | Ruta | Descripción | Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | `200` — mensaje de la API |
| `GET` | `/api/productos` | Lista todos los productos | `200` — array de productos |
| `GET` | `/api/productos/:id` | Detalle de un producto | `200` — producto · `400` — id inválido · `404` — no existe |
| `POST` | `/api/productos` | Crea un producto | `201` — producto creado · `400` — datos inválidos |
| `PUT` | `/api/productos/:id` | Actualiza los campos enviados | `200` — producto actualizado · `400` · `404` |
| `DELETE` | `/api/productos/:id` | Elimina un producto | `200` — producto eliminado · `400` · `404` |
| `GET` | `/catalogo/:imagen` | Imagen del catálogo (archivo estático) | `200` — `image/webp` |

**El producto:**

```json
{
  "_id": "6ae7cabd386def6702e2fa39",
  "nombre": "Aparador Uspallata",
  "descripcion": "Aparador de líneas limpias inspirado en los valles de Uspallata...",
  "precio": 245000,
  "stock": 10,
  "imagenUrl": "catalogo/aparador-uspallata.webp",
  "createdAt": "2026-11-01T23:37:33.000Z",
  "updatedAt": "2026-11-01T23:37:33.000Z"
}
```

`nombre` y `precio` son obligatorios; `precio` y `stock` no pueden ser negativos y `stock` vale `0` si no se manda.

**Errores:** siempre en JSON. Cuando los datos no son válidos, la respuesta trae el detalle de cada campo:

```json
{ "error": "Datos inválidos", "detalles": { "precio": "Path `precio` (-5) is less than minimum allowed value (0)." } }
```

Sobre `/api/productos` se admiten `GET` y `POST`, y sobre `/api/productos/:id`, `GET`, `PUT` y `DELETE`. Los demás métodos devuelven `405 Method Not Allowed` con el header `Allow`.

```bash
curl http://localhost:3000/api/productos
curl -X POST http://localhost:3000/api/productos -H "Content-Type: application/json" -d '{"nombre":"Banqueta Tilcara","precio":95000,"stock":3}'
curl -i http://localhost:3000/api/productos/000000000000000000000000      # 404
```

**Postman:** la colección está en `backend/postman/jota-api.postman_collection.json`. Al importarla, la variable `baseUrl` apunta a `http://localhost:3000`. Conviene correrla en orden: "Crear producto" guarda el `_id` que después usan "Obtener", "Actualizar" y "Eliminar", y cada pedido tiene un test que controla el código de respuesta.

---

## 🔐 Variables de entorno

**Backend** — `backend/.env`. No se sube al repo porque tiene la contraseña de la base: cada integrante lo crea con el connection string que se comparte por un canal privado.

| Variable | Obligatoria | Valor por defecto | Para qué sirve |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Sí | — | Connection string de MongoDB Atlas |
| `PORT` | No | `3000` | Puerto de la API |
| `CORS_ORIGIN` | No | `http://localhost:5173,http://localhost:5174,http://localhost:4173` | Orígenes que pueden consultar la API, separados por coma |

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
```

**Frontend** — `client/.env`. Viene en el repo, porque solo tiene la URL de la API, que no es secreta.

| Variable | Valor local | Para qué sirve |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:3000` | URL base de la API |

---

## 💻 Cómo correrlo localmente

**Requisito previo:** Node.js 18 o superior (probado en Node 24).

Cloná el repositorio:

```bash
git clone https://github.com/TinchoARS/HermanosJota-E-commerce.git
cd HermanosJota-E-commerce
```

### 1. Backend

Creá `backend/.env` con `MONGODB_URI` (ver [Variables de entorno](#-variables-de-entorno)) y después:

```bash
cd backend
npm install
npm run dev        # o: npm start
```

Primero se conecta a MongoDB y, recién cuando la conexión está lista, queda escuchando en `http://localhost:3000`. Si no puede conectarse, muestra el error y se cierra.

### 2. Frontend

En **otra terminal**:

```bash
cd client
npm install
npm run dev
```

El `client/.env` viene en el repo con `VITE_API_URL=http://localhost:3000`, así que no hay que crear nada.

Queda disponible en `http://localhost:5173`.

> Necesitás las dos terminales corriendo a la vez: el frontend no tiene los productos adentro, los pide a la API en cada carga.

### 3. Seed (carga inicial del catálogo)

La base compartida ya tiene cargados los 11 productos del catálogo, así que **no hace falta correrlo** para trabajar.

Si hace falta restaurarlo, el script borra todos los productos de la base y carga los 11 del catálogo inicial con stock 10:

```bash
cd backend
npm run seed
```

> ⚠️ El seed reemplaza todo el catálogo: se pierden los productos creados desde la app y los `_id` cambian, así que los carritos guardados quedan vacíos.

### Sobre los puertos

El backend escucha en el **3000** y el frontend en el **5173**, así que no se pisan. Ese desacople viene de usar **Vite**, que por defecto levanta el dev server en el 5173; antes, con Create React App, el frontend también iba al 3000 y ahí sí había conflicto.

El **3000 se mantiene por decisión conjunta del grupo, siguiendo la recomendación de la profesora**. También se evaluaron el 8080 y el 3001, pero se eligió el 3000 por ser la convención de Node/Express y el indicado en el curso.

Si en tu máquina el 3000 está ocupado, corré el backend en otro puerto y poné `VITE_API_URL=http://localhost:4000` en `client/.env`:

```bash
PORT=4000 npm run dev            # macOS, Linux o Git Bash
$env:PORT=4000; npm run dev      # Windows (PowerShell)
```

---

## 🚀 Deploy

Los dos proyectos están en Vercel y se despliegan desde `main`: lo que se mergea a `main` es lo que queda en producción.

| Proyecto | Root directory | Variables de entorno |
| :--- | :--- | :--- |
| API | `backend` | `MONGODB_URI` y `CORS_ORIGIN=https://hermanosjota-ecommerce-zeta.vercel.app` |
| Frontend | `client` | `VITE_API_URL=https://hermanosjota-api-livid.vercel.app` |

- En MongoDB Atlas, **Network Access** tiene que permitir `0.0.0.0/0`, porque Vercel no tiene IPs fijas.
- El frontend necesita el rewrite de `client/vercel.json`: sin él, recargar la página en `/productos/abc` daría 404, porque esa ruta la resuelve React Router y no existe como archivo.

---

## 🔀 Flujo de trabajo

El equipo trabaja con ramas propias a partir de `develop`, siguiendo el formato `nombre/TituloCambios`. Los cambios se integran mediante Pull Requests hacia `develop`, donde `main` recibe las versiones estables.

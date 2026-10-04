# 🛋️ E-commerce Mueblería Hermanos Jota

Sitio web de e-commerce para una mueblería, desarrollado como proyecto grupal del curso Full Stack Developer (ITBA). Permite navegar un catálogo de muebles, ver el detalle de cada producto, agregarlos a un carrito de compras simulado y contactar a la tienda mediante un formulario.

A diferencia de la primera versión del proyecto, los datos ya no viven en un array dentro del navegador: el frontend es una aplicación React que consume una API REST propia, con el catálogo servido desde el backend.

---

## 📋 Descripción del proyecto

El proyecto está dividido en dos partes:

- **`backend/`** — API REST con Express. Expone el catálogo de productos, sirve las imágenes del catálogo como archivos estáticos y centraliza el manejo de errores. Los datos están en un array de objetos JavaScript que cumple el mismo papel que cumpliría una base de datos.
- **`client/`** — aplicación React (Vite) de una sola página. Se conecta a la API, muestra el catálogo, el detalle de cada producto y el carrito.

La API expone el catálogo y lo consume el frontend con `fetch` a través de hooks propios que manejan los estados de carga, error y vacío.

---

## 🧭 Decisiones tomadas

- **API propia con Express en vez de datos en el frontend.** Es el objetivo central del sprint: el cliente ya no tiene los productos hardcodeados, los pide por HTTP.
- **Vite en lugar de Create React App.** La consigna menciona CRA, pero CRA levanta el frontend en el 3000, igual que el backend, y eso genera un conflicto de puertos. Vite usa el 5173 y ambos conviven. El listado de mejoras del curso también lo propone.
- **Puerto 3000 para la API**, por decisión del grupo siguiendo la recomendación de la profesora. También se evaluaron el 8080 y el 3001.
- **CORS con lista de orígenes permitidos** en lugar de `cors()` abierto: el frontend puede consultar la API, pero otras páginas que el usuario tenga abiertas en el navegador no.
- **Imágenes servidas por el backend** desde `public/catalogo`, y no desde el frontend, para que todo el catálogo viva en un solo lado.
- **Carrito simulado, sin persistencia ni checkout.** Es una simulación de estado: el contador vive en `App.jsx` y no hay backend de carritos.
- **Lógica en hooks propios y `App.jsx` como orquestador.** El catálogo (`useProductos`), el carrito (`useCarrito`) y la navegación entre vistas (`useNavegacion`) están en hooks separados. `App.jsx` los llama y reparte los datos por props, así queda chico y cada parte se puede leer sola. El estado del carrito sigue viviendo en `App`, porque un hook guarda su estado en el componente que lo usa.
- **Navegación sin router.** El catálogo y el detalle son vistas que `App.jsx` alterna con renderizado condicional, como pide la consigna. Por eso los links del navbar no son anclas comunes: si el usuario está en el detalle, primero se vuelve al catálogo y después se scrollea a la sección.
- **Datos en un array de JavaScript**, según lo que pide la consigna. Cuando haya base de datos, se reemplaza ese archivo y el resto de la app no cambia.
- **Carrito en el centro del header y con la palabra "Carrito" al lado del ícono.** Fue una decisión del grupo a partir de las correcciones de la primera entrega: el ícono quedaba aislado en el extremo derecho y se leía como un detalle menor. Centrado en la barra y con texto al lado, el carrito pasa a ser una sección más de la tienda.
- **Imagen en el home.** El home arrancaba solo con texto. Se agregó un banner con una imagen y un botón de "Ver catálogo", con el objetivo de darle mayor impacto al usuario en la primera impresión. La imagen se importa como módulo desde React y se le pasa al CSS como variable, para que el degradado que garantiza el contraste del texto quede en la hoja de estilos.

---

## 👥 Integrantes

| Nombre | Rol / Parte del proyecto |
| :--- | :--- |
| Gastón Guber | API en Express (endpoints, rutas modulares y middlewares) y **mejoras de integración**: CORS, imágenes servidas desde el backend y `README` |
| Martin Fradejas Soria | Catálogo de productos: `ProductCard`, `ProductList`, hook `useProductos` y el renderizado condicional del detalle en `App.jsx` |
| Cristian Benjamin Cerioni Lanzilotta | Base del frontend con Vite, estilos y variables del manual de marca, `Navbar`, `Footer` y `ContactForm` |

---

## ✨ Funcionalidades

**Frontend**

- **Navbar:** logo, navegación (Inicio, Catálogo, Contacto) y botón de carrito en el centro de la barra, con ícono, la palabra "Carrito" y el contador de productos agregados. Queda fijo arriba al scrollear, así el carrito esté siempre a la vista, y en celular se acomoda en dos filas. Los links funcionan desde cualquier vista, incluido el detalle.
- **Hero:** banner de bienvenida con imagen, título y botón "Ver catálogo".
- **Catálogo de productos:** grilla de tarjetas con imagen, nombre y precio en formato ARS. Incluye estados de carga (spinner), de error con botón "Reintentar" y de lista vacía.
- **Detalle de producto:** imagen grande, nombre, descripción completa y precio, con los botones "Agregar al carrito" y "Volver al catálogo". El producto se pide a la API por id y maneja el 404 mostrando "Producto no encontrado". Al volver, el catálogo recupera la posición de scroll en la que estaba.
- **Carrito de compras:** contador visible en el navbar, manejado con estado de React. Al agregar un producto aparece un aviso flotante que se ve sin importar dónde esté la página y se oculta solo. Es una simulación: no hay persistencia ni checkout.
- **Formulario de contacto:** formulario controlado con validación propia: campos obligatorios (no acepta solo espacios) y formato de email, con el error debajo de cada campo. Al enviar muestra un mensaje de éxito en la página y limpia los campos.
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
│   │   ├── App.jsx                # Arma la página: conecta los hooks con los componentes
│   │   ├── assets/
│   │   │   ├── logo.svg
│   │   │   └── hero.png           # Imagen del banner
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── AvisoCarrito.jsx   # Aviso flotante "se agregó al carrito"
│   │   ├── hooks/
│   │   │   ├── useProductos.js    # GET /api/productos
│   │   │   ├── useProducto.js     # GET /api/productos/:id
│   │   │   ├── useCarrito.js      # Estado del carrito y del aviso
│   │   │   └── useNavegacion.js   # Vistas catálogo/detalle, secciones y scroll
│   │   └── styles/
│   │       ├── style.css          # Variables, navbar, hero, aviso, footer y contacto
│   │       ├── catalogo.css       # Grilla y estados del catálogo
│   │       └── producto-detalle.css
│   └── package.json
│
└── README.md
```

## 🔌 Endpoints de la API

Base: `http://localhost:3000`

| Método | Ruta | Descripción | Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | `200` — mensaje de la API |
| `GET` | `/api/productos` | Lista todos los productos | `200` — array con los 11 productos |
| `GET` | `/api/productos/:id` | Detalle de un producto | `200` — objeto · `400` — id no numérico · `404` — no existe |
| `GET` | `/catalogo/:imagen` | Imagen del catálogo (archivo estático) | `200` — `image/png` |

Sobre `/api/productos` solo se admite `GET`: los demás métodos devuelven `405 Method Not Allowed`. Las rutas inexistentes devuelven `404` y los errores internos `500`, siempre en JSON.

```bash
curl http://localhost:3000/api/productos
curl -i http://localhost:3000/api/productos/999      # 404
```

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

El paso `cp .env.example .env` **no es opcional**: el `.env` está en el `.gitignore`, así que cada quien tiene que crear el suyo con la dirección de la API.

Queda disponible en `http://localhost:5173`.

> Necesitás las dos terminales corriendo a la vez: el frontend no tiene los productos adentro, los pide a la API en cada carga.

### Sobre los puertos

El backend escucha en el **3000** y el frontend en el **5173**, así que no se pisan. Ese desacople viene de usar **Vite**, que por defecto levanta el dev server en el 5173; antes, con Create React App, el frontend también iba al 3000 y ahí sí había conflicto.

El **3000 se mantiene por decisión conjunta del grupo, siguiendo la recomendación de la profesora**. También se evaluaron el 8080 y el 3001, pero se eligió el 3000 por ser la convención de Node/Express y el indicado en el curso.

Si en tu máquina el 3000 está ocupado, corré el backend en otro puerto y poné `VITE_API_URL=http://localhost:4000` en tu `.env`:

```bash
PORT=4000 npm run dev            # macOS, Linux o Git Bash
$env:PORT=4000; npm run dev      # Windows (PowerShell)
```

En Windows, `cp .env.example .env` funciona en PowerShell y Git Bash. En cmd se usa `copy .env.example .env`.

---

## 🔀 Flujo de trabajo

El equipo trabaja con ramas propias a partir de `develop`, siguiendo el formato `nombre/TituloCambios`. Los cambios se integran mediante Pull Requests hacia `develop`, donde `main` recibe las versiones estables.

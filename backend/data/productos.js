// Catálogo hardcodeado. Fuente única de verdad para la API: el controller
// importa este mismo array, así que no hay datos duplicados.
//
// Campos: id (identificador), nombre, descripcion, precio (en pesos, sin
// símbolo) e imagen (ruta dentro de public/catalogo).
//
// Cuando haya base de datos, este archivo se reemplaza por consultas y el
// resto de la app no necesita cambios.

const productos = [
  {
    id: 1,
    nombre: "Aparador Uspallata",
    descripcion:
      "Aparador de líneas limpias inspirado en los valles de Uspallata. Fabricado en nogal negro con patas de algarrobo, ofrece amplio almacenamiento oculto tras una puerta corrediza y un cajón interno. Su superficie mate realza la veta natural de la madera.",
    precio: 245000,
    imagen: "catalogo/aparador-uspallata.webp",
  },
  {
    id: 2,
    nombre: "Biblioteca Recoleta",
    descripcion:
      "Biblioteca estante abierto que evoca los balcones de Recoleta. Estructura de roble claro con repisas regulables y base cerrada para ocultar objetos. Diseño modular que permite combinar unidades verticales.",
    precio: 320000,
    imagen: "catalogo/biblioteca-recoleta.webp",
  },
  {
    id: 3,
    nombre: "Butaca Mendoza",
    descripcion:
      "Butaca de descanso con respaldo abultado y reposabrazos envolventes. Inspirada en los sillones de estancia mendocina, combina comodidad profunda con una silueta compacta ideal para espacios modernos.",
    precio: 188000,
    imagen: "catalogo/butaca-mendoza.webp",
  },
  {
    id: 4,
    nombre: "Mesa de Centro Araucaria",
    descripcion:
      "Mesa de centro de forma orgánica con borde vivo tallado. La textura marcada de la araucaria se convierte en el protagonista visual. Base cruzada de hierro negro mate que aporta contraste industrial.",
    precio: 156000,
    imagen: "catalogo/mesa-de-centro-araucaria.webp",
  },
  {
    id: 5,
    nombre: "Mesa de Noche Aconcagua",
    descripcion:
      "Mesa de noche minimalista inspirada en la pureza de las cumbres. Un único cajón con cierre suave y una repisa inferior abierta. Forma rectangular con esquinas redondeadas para un toque amable.",
    precio: 98000,
    imagen: "catalogo/mesa-de-noche-aconcagua.webp",
  },
  {
    id: 6,
    nombre: "Escritorio Costa",
    descripcion:
      "Escritorio de trabajo con cajones laterales y repisa elevada para monitor. Inspirado en los muebles de oficina de la costa atlántica, combina funcionalidad profesional con calidez artesanal.",
    precio: 289000,
    imagen: "catalogo/escritorio-costa.webp",
  },
  {
    id: 7,
    nombre: "Mesa Comedor Pampa",
    descripcion:
      "Mesa de comedor extensible para ocho personas, inspirada en la amplitud de la pampa. Tablero de una sola pieza con borde natural live-edge. Extensiones ocultas bajo la superficie.",
    precio: 410000,
    imagen: "catalogo/mesa-comedor-pampa.webp",
  },
  {
    id: 8,
    nombre: "Silla de Trabajo Belgrano",
    descripcion:
      "Silla de escritorio ergonómica con respaldo curvo y asiento acolchado. Inspirada en las sillas de biblioteca del barrio Belgrano, ofrece soporte lumbar natural y un diseño que se integra en cualquier ambiente.",
    precio: 132000,
    imagen: "catalogo/silla-de-trabajo-belgrano.webp",
  },
  {
    id: 9,
    nombre: "Sillas Córdoba",
    descripcion:
      "Par de sillas de comedor con respaldo ligeramente inclinado y asiento entrelazado de cuero. Inspiradas en las sillas de las casonas cordobesas, equilibran elegancia clásica y confort contemporáneo.",
    precio: 260000,
    imagen: "catalogo/sillas-cordoba.webp",
  },
  {
    id: 10,
    nombre: "Sillón Copacabana",
    descripcion:
      "Sillón de tres cuerpos con patas elevadas y tapizado profundo. Inspirado en los sofás de playa de Copacabana, su amplitud invita al descanso prolongado. Respaldo con cojines independientes extraíbles.",
    precio: 385000,
    imagen: "catalogo/sillon-copacabana.webp",
  },
  {
    id: 11,
    nombre: "Sofá Patagonia",
    descripcion:
      "Sofá modular de cinco piezas inspirado en la vastedad patagónica. Configuración en L con chaise longue integrada. Módulos independientes que permiten reconfigurar el sillón según el espacio.",
    precio: 520000,
    imagen: "catalogo/sofa-patagonia.webp",
  },
];

module.exports = productos;

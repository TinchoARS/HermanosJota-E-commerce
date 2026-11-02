import 'dotenv/config';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Product from '../models/Product.js';

const STOCK_INICIAL = 10;

const PRODUCTOS_INICIALES = [
  {
    nombre: 'Aparador Uspallata',
    descripcion:
      'Aparador de líneas limpias inspirado en los valles de Uspallata. Fabricado en nogal negro con patas de algarrobo, ofrece amplio almacenamiento oculto tras una puerta corrediza y un cajón interno. Su superficie mate realza la veta natural de la madera.',
    precio: 245000,
    imagenUrl: 'catalogo/aparador-uspallata.webp',
  },
  {
    nombre: 'Biblioteca Recoleta',
    descripcion:
      'Biblioteca estante abierto que evoca los balcones de Recoleta. Estructura de roble claro con repisas regulables y base cerrada para ocultar objetos. Diseño modular que permite combinar unidades verticales.',
    precio: 320000,
    imagenUrl: 'catalogo/biblioteca-recoleta.webp',
  },
  {
    nombre: 'Butaca Mendoza',
    descripcion:
      'Butaca de descanso con respaldo abultado y reposabrazos envolventes. Inspirada en los sillones de estancia mendocina, combina comodidad profunda con una silueta compacta ideal para espacios modernos.',
    precio: 188000,
    imagenUrl: 'catalogo/butaca-mendoza.webp',
  },
  {
    nombre: 'Mesa de Centro Araucaria',
    descripcion:
      'Mesa de centro de forma orgánica con borde vivo tallado. La textura marcada de la araucaria se convierte en el protagonista visual. Base cruzada de hierro negro mate que aporta contraste industrial.',
    precio: 156000,
    imagenUrl: 'catalogo/mesa-de-centro-araucaria.webp',
  },
  {
    nombre: 'Mesa de Noche Aconcagua',
    descripcion:
      'Mesa de noche minimalista inspirada en la pureza de las cumbres. Un único cajón con cierre suave y una repisa inferior abierta. Forma rectangular con esquinas redondeadas para un toque amable.',
    precio: 98000,
    imagenUrl: 'catalogo/mesa-de-noche-aconcagua.webp',
  },
  {
    nombre: 'Escritorio Costa',
    descripcion:
      'Escritorio de trabajo con cajones laterales y repisa elevada para monitor. Inspirado en los muebles de oficina de la costa atlántica, combina funcionalidad profesional con calidez artesanal.',
    precio: 289000,
    imagenUrl: 'catalogo/escritorio-costa.webp',
  },
  {
    nombre: 'Mesa Comedor Pampa',
    descripcion:
      'Mesa de comedor extensible para ocho personas, inspirada en la amplitud de la pampa. Tablero de una sola pieza con borde natural live-edge. Extensiones ocultas bajo la superficie.',
    precio: 410000,
    imagenUrl: 'catalogo/mesa-comedor-pampa.webp',
  },
  {
    nombre: 'Silla de Trabajo Belgrano',
    descripcion:
      'Silla de escritorio ergonómica con respaldo curvo y asiento acolchado. Inspirada en las sillas de biblioteca del barrio Belgrano, ofrece soporte lumbar natural y un diseño que se integra en cualquier ambiente.',
    precio: 132000,
    imagenUrl: 'catalogo/silla-de-trabajo-belgrano.webp',
  },
  {
    nombre: 'Sillas Córdoba',
    descripcion:
      'Par de sillas de comedor con respaldo ligeramente inclinado y asiento entrelazado de cuero. Inspiradas en las sillas de las casonas cordobesas, equilibran elegancia clásica y confort contemporáneo.',
    precio: 260000,
    imagenUrl: 'catalogo/sillas-cordoba.webp',
  },
  {
    nombre: 'Sillón Copacabana',
    descripcion:
      'Sillón de tres cuerpos con patas elevadas y tapizado profundo. Inspirado en los sofás de playa de Copacabana, su amplitud invita al descanso prolongado. Respaldo con cojines independientes extraíbles.',
    precio: 385000,
    imagenUrl: 'catalogo/sillon-copacabana.webp',
  },
  {
    nombre: 'Sofá Patagonia',
    descripcion:
      'Sofá modular de cinco piezas inspirado en la vastedad patagónica. Configuración en L con chaise longue integrada. Módulos independientes que permiten reconfigurar el sillón según el espacio.',
    precio: 520000,
    imagenUrl: 'catalogo/sofa-patagonia.webp',
  },
];

const seed = async () => {
  await connectDB();

  const productos = PRODUCTOS_INICIALES.map((producto) => ({ ...producto, stock: STOCK_INICIAL }));

  await Product.deleteMany({});
  const productosInsertados = await Product.insertMany(productos);
  console.log(`Se cargaron ${productosInsertados.length} productos`);

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Error al ejecutar el seed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});

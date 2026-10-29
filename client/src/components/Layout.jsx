import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AvisoCarrito from './AvisoCarrito';
import ScrollAlNavegar from './ScrollAlNavegar';
import useProductos from '../hooks/useProductos';
import useCarrito from '../hooks/useCarrito';

const FILTROS_INICIALES = { busqueda: '', orden: 'destacados' };

const Layout = () => {
  const catalogo = useProductos();
  const carrito = useCarrito(catalogo.productos);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const { aviso, ...accionesCarrito } = carrito;

  return (
    <>
      <ScrollAlNavegar />

      <Navbar
        cantidadCarrito={carrito.cantidad}
        itemsCarrito={carrito.items}
        totalCarrito={carrito.total}
        onCambiarCantidad={carrito.cambiarCantidad}
        onQuitarDelCarrito={carrito.quitarDelCarrito}
        onFinalizarCompra={carrito.vaciarCarrito}
      />

      <main>
        <Outlet context={{ ...catalogo, ...accionesCarrito, filtros, setFiltros }} />
      </main>

      <Footer />

      <AvisoCarrito aviso={aviso} />
    </>
  );
};

export default Layout;

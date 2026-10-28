import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AvisoCarrito from './components/AvisoCarrito';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import useProductos from './hooks/useProductos';
import useCarrito from './hooks/useCarrito';
import useNavegacion from './hooks/useNavegacion';

function App() {
  const { productos, loading, error, recargar } = useProductos();
  const {
    items,
    cantidad,
    total,
    aviso,
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
  } = useCarrito(productos);
  const { productoId, verDetalle, volverAlCatalogo, navegar } = useNavegacion();

  const [filtros, setFiltros] = useState({ busqueda: '', orden: 'destacados' });

  return (
    <>
      <Navbar
        cantidadCarrito={cantidad}
        itemsCarrito={items}
        totalCarrito={total}
        onNavegar={navegar}
        onCambiarCantidad={cambiarCantidad}
        onQuitarDelCarrito={quitarDelCarrito}
        onFinalizarCompra={vaciarCarrito}
      />

      <main>
        {productoId !== null ? (
          <ProductDetail
            key={productoId}
            id={productoId}
            productoInicial={productos.find((p) => p.id === productoId)}
            onVolver={volverAlCatalogo}
            onAgregar={agregarAlCarrito}
          />
        ) : (
          <>
            <Hero onVerCatalogo={() => navegar('catalogo')} />
            <div id="catalogo">
              <ProductList
                productos={productos}
                loading={loading}
                error={error}
                onReintentar={recargar}
                onSeleccionar={verDetalle}
                onAgregar={agregarAlCarrito}
                filtros={filtros}
                onCambiarFiltros={setFiltros}
              />
            </div>
          </>
        )}

        <ContactForm vista={productoId ?? 'catalogo'} />
      </main>

      <Footer />

      <AvisoCarrito aviso={aviso} />
    </>
  );
}

export default App;

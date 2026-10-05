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

// App solo arma la página y conecta el estado con los componentes. La lógica
// vive en hooks propios: el catálogo en useProductos, el carrito en
// useCarrito y el cambio de vistas y secciones en useNavegacion.
function App() {
  // El catálogo completo se pide una sola vez desde el hook.
  const { productos, loading, error, recargar } = useProductos();
  // El carrito recibe el catálogo porque guarda solo los ids y las cantidades:
  // los nombres y los precios se resuelven contra productos.
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

  // Búsqueda y orden del catálogo. Viven acá y no en ProductList porque la
  // lista se desmonta al entrar a un detalle, y al volver el usuario espera
  // encontrar el catálogo como lo dejó.
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
        {/* Renderizado condicional: detalle si la URL apunta a un producto,
            catálogo en cualquier otro caso. */}
        {productoId !== null ? (
          <ProductDetail
            // key: al pasar de un producto a otro el detalle arranca de cero
            // (por ejemplo, la cantidad vuelve a 1).
            key={productoId}
            id={productoId}
            // Si la lista ya llegó, el detalle la usa para pintar al instante.
            productoInicial={productos.find((p) => p.id === productoId)}
            onVolver={volverAlCatalogo}
            onAgregar={agregarAlCarrito}
          />
        ) : (
          <>
            <Hero onVerCatalogo={() => navegar('catalogo')} />
            {/* El id va acá y no en ProductList para que el link "Catálogo"
                funcione también mientras carga o si la API falló. */}
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

        {/* Fuera del condicional a propósito: el contacto está en las dos
            vistas, así el link "Contacto" funciona también desde el detalle.
            vista le avisa cuándo se cambió de vista. */}
        <ContactForm vista={productoId ?? 'catalogo'} />
      </main>

      <Footer />

      <AvisoCarrito aviso={aviso} />
    </>
  );
}

export default App;

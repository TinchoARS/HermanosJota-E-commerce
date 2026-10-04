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
  const { cantidad, aviso, agregarAlCarrito } = useCarrito();
  const { productoSeleccionado, verDetalle, volverAlCatalogo, navegar } = useNavegacion();

  return (
    <>
      <Navbar cantidadCarrito={cantidad} onNavegar={navegar} />

      <main>
        {/* Renderizado condicional: detalle si hay algo seleccionado,
            catálogo en cualquier otro caso. */}
        {productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
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
              />
            </div>
          </>
        )}

        {/* Fuera del condicional a propósito: el contacto está en las dos
            vistas, así el link "Contacto" funciona también desde el detalle. */}
        <ContactForm />
      </main>

      <Footer />

      <AvisoCarrito aviso={aviso} />
    </>
  );
}

export default App;

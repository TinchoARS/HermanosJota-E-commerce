import { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import useProductos from './hooks/useProductos';

function App() {
  // C4 - El catálogo completo se pide una sola vez desde el hook.
  const { productos, loading, error, recargar } = useProductos();

  // F10 - Vistas de la app. null = catálogo, un producto = su detalle.
  // Se guarda el objeto entero (no solo el id) porque el detalle lo usa
  // para pedir los datos frescos a la API y para pintar sin esperarlas.
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // F9 - Carrito: se guardan los ids agregados. Con guardar el id alcanza
  // para contar y evita duplicar en memoria los objetos completos.
  const [carrito, setCarrito] = useState([]);

  // F9 - onAgregar baja desde ProductList y desde ProductDetail hasta acá.
  // Se usa la forma funcional de setState porque así React usa el valor
  // más reciente del carrito y no el del render en que se creó la función.
  const agregarAlCarrito = (producto) => {
    setCarrito((items) => [...items, producto.id]);
  };

  // F10 - onSeleccionar desde ProductList, onVolver desde ProductDetail.
  const verDetalle = (producto) => setProductoSeleccionado(producto);
  const volverAlCatalogo = () => setProductoSeleccionado(null);

  return (
    <>
      <Navbar cantidadCarrito={carrito.length} />

      <main>
        {/* F10 - Renderizado condicional: detalle si hay algo seleccionado,
            catálogo en cualquier otro caso. */}
        {productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
            onVolver={volverAlCatalogo}
            onAgregar={agregarAlCarrito}
          />
        ) : (
          <ProductList
            productos={productos}
            loading={loading}
            error={error}
            onReintentar={recargar}
            onSeleccionar={verDetalle}
            onAgregar={agregarAlCarrito}
          />
        )}

        <ContactForm />
      </main>

      <Footer />
    </>
  );
}

export default App;

import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import useProductos from './hooks/useProductos';

function App() {
  // C4: el catálogo se pide a la API al montar la app.
  const { productos, loading, error, recargar } = useProductos();

  // Provisorios hasta F9/F10 (Persona 3): carrito y navegación al detalle.
  const verDetalle = (producto) => console.log('Ver detalle', producto.id);
  const agregarAlCarrito = (producto) => console.log('Agregar', producto.id);

  return (
    <>
      <Navbar cantidadCarrito={0} />
      <main>
        <ProductList
          productos={productos}
          loading={loading}
          error={error}
          onReintentar={recargar}
          onSeleccionar={verDetalle}
          onAgregar={agregarAlCarrito}
        />
      </main>
    </>
  )
}

export default App;

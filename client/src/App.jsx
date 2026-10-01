import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ContactForm from './components/ContactForm'; // <-- Agregás esta línea
import Footer from './components/Footer';
import useProductos from './hooks/useProductos';

function App() {
  const { productos, loading, error, recargar } = useProductos();

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
        
        {/* Renderizado del Formulario de Contacto (Task F8) */}
        <ContactForm />
      </main>
      
      <Footer />
    </>
  )
}

export default App;
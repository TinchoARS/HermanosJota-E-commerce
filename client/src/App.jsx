import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AvisoCarrito from './components/AvisoCarrito';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import useProductos from './hooks/useProductos';

function App() {
  // El catálogo completo se pide una sola vez desde el hook.
  const { productos, loading, error, recargar } = useProductos();

  // Vistas de la app. null = catálogo, un producto = su detalle.
  // Se guarda el objeto entero (no solo el id) porque el detalle lo usa
  // para pedir los datos frescos a la API y para pintar sin esperarlas.
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Carrito: se guardan los ids agregados. Con guardar el id alcanza
  // para contar y evita duplicar en memoria los objetos completos.
  const [carrito, setCarrito] = useState([]);

  // Aviso flotante del último producto agregado. null = no se muestra.
  const [aviso, setAviso] = useState(null);

  // onAgregar baja desde ProductList y desde ProductDetail hasta acá.
  // Se usa la forma funcional de setState porque así React usa el valor
  // más reciente del carrito y no el del render en que se creó la función.
  const agregarAlCarrito = (producto) => {
    setCarrito((items) => [...items, producto.id]);
    // Date.now() como id: cada agregado es un aviso nuevo, aunque sea el
    // mismo producto, así se reinicia el temporizador y la animación.
    setAviso({ id: Date.now(), nombre: producto.nombre });
  };

  // El aviso se oculta solo a los 2,5 s. Si se agrega otro antes, el cleanup
  // cancela el temporizador anterior y arranca uno nuevo.
  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 2500);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  // Posición del scroll en el catálogo al entrar a un detalle, para
  // devolver al usuario al mismo lugar cuando vuelve. null = nada guardado.
  const scrollCatalogo = useRef(null);

  // onSeleccionar desde ProductList, onVolver desde ProductDetail.
  const verDetalle = (producto) => {
    scrollCatalogo.current = window.scrollY;
    setProductoSeleccionado(producto);
  };
  const volverAlCatalogo = () => setProductoSeleccionado(null);

  // Sección a la que hay que ir después de cambiar de vista (ver navegar).
  const seccionPendiente = useRef(null);

  const irASeccion = (seccion) => {
    if (seccion === 'inicio') {
      window.scrollTo(0, 0);
    } else {
      document.getElementById(seccion)?.scrollIntoView();
    }
  };

  // onNavegar desde Navbar. Contacto existe en las dos vistas, pero Inicio y
  // Catálogo son del catálogo: desde el detalle primero se vuelve a la lista
  // y el scroll se hace en el useLayoutEffect, cuando ya está en el DOM.
  const navegar = (seccion) => {
    if (productoSeleccionado && seccion !== 'contacto') {
      seccionPendiente.current = seccion;
      scrollCatalogo.current = null;
      setProductoSeleccionado(null);
    } else {
      irASeccion(seccion);
    }
  };

  // Al cambiar de vista, el navegador mantiene el scroll anterior: el
  // detalle aparecía a mitad de página. Se lleva el detalle arriba de todo y,
  // al volver, se restaura la posición guardada del catálogo.
  // Se usa useLayoutEffect y no useEffect porque corre cuando el DOM ya se
  // actualizó pero antes de que el navegador pinte: así la vista nueva no se
  // muestra un instante en la posición vieja antes de "saltar".
  useLayoutEffect(() => {
    if (productoSeleccionado) {
      window.scrollTo(0, 0);
    } else if (seccionPendiente.current !== null) {
      irASeccion(seccionPendiente.current);
      seccionPendiente.current = null;
    } else if (scrollCatalogo.current !== null) {
      window.scrollTo(0, scrollCatalogo.current);
      scrollCatalogo.current = null;
    }
  }, [productoSeleccionado]);

  return (
    <>
      <Navbar cantidadCarrito={carrito.length} onNavegar={navegar} />

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

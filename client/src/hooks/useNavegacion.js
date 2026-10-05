import { useLayoutEffect, useRef, useState } from 'react';

// Lleva al destino una sección de la página. Inicio es el tope de todo.
const irASeccion = (seccion) => {
  if (seccion === 'inicio') {
    window.scrollTo(0, 0);
  } else {
    document.getElementById(seccion)?.scrollIntoView();
  }
};

// Navegación entre las vistas de la app (catálogo y detalle) y entre las
// secciones del navbar, con el manejo del scroll al cambiar de vista.
const useNavegacion = () => {
  // Vistas de la app. null = catálogo, un producto = su detalle.
  // Se guarda el objeto entero (no solo el id) porque el detalle lo usa
  // para pedir los datos frescos a la API y para pintar sin esperarlas.
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Posición del scroll en el catálogo al entrar a un detalle, para
  // devolver al usuario al mismo lugar cuando vuelve. null = nada guardado.
  const scrollCatalogo = useRef(null);

  // Sección a la que hay que ir después de cambiar de vista (ver navegar).
  const seccionPendiente = useRef(null);

  // onSeleccionar desde ProductList, onVolver desde ProductDetail.
  const verDetalle = (producto) => {
    scrollCatalogo.current = window.scrollY;
    setProductoSeleccionado(producto);
  };
  const volverAlCatalogo = () => setProductoSeleccionado(null);

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

  return { productoSeleccionado, verDetalle, volverAlCatalogo, navegar };
};

export default useNavegacion;

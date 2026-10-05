import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// El detalle de un producto vive en el hash de la URL: #producto-3 es el
// detalle del producto 3, y cualquier otra cosa es el catálogo. Así el link
// del detalle se puede compartir y el botón "atrás" del navegador vuelve al
// catálogo, sin sumar un router (la consigna pide alternar las vistas con
// renderizado condicional).
const PREFIJO_PRODUCTO = 'producto-';

// Devuelve el id del producto del hash actual, o null si no es un detalle.
const leerProductoDelHash = () => {
  const coincidencia = window.location.hash.match(/^#producto-(\d+)$/);
  return coincidencia ? Number(coincidencia[1]) : null;
};

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
  // Vista actual. null = catálogo, un número = id del producto en detalle.
  // Arranca desde el hash, así un link a #producto-3 abre directo el detalle.
  const [productoId, setProductoId] = useState(leerProductoDelHash);

  // Posición del scroll en el catálogo al entrar a un detalle, para
  // devolver al usuario al mismo lugar cuando vuelve. null = nada guardado.
  const scrollCatalogo = useRef(null);

  // Sección a la que hay que ir después de cambiar de vista (ver navegar).
  const seccionPendiente = useRef(null);

  // Si se entró al detalle desde el catálogo de esta misma visita. En ese
  // caso "volver" es lo mismo que el "atrás" del navegador; si se llegó por
  // un link directo, atrás saldría del sitio.
  const vinoDelCatalogo = useRef(false);

  // El scroll lo maneja la app (ver el useLayoutEffect de abajo). Si el
  // navegador también lo restaura al ir atrás, los dos se pisan.
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  // Toda la navegación pasa por el hash: los clics de la app lo cambian y el
  // navegador avisa con hashchange, igual que con atrás y adelante.
  useEffect(() => {
    const alCambiarHash = () => {
      const id = leerProductoDelHash();
      // Si el catálogo está en pantalla, se está saliendo de él: se guarda
      // dónde estaba para restaurarlo al volver.
      if (id !== null && document.getElementById('catalogo')) {
        scrollCatalogo.current = window.scrollY;
      }
      setProductoId(id);
    };
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  // onSeleccionar desde ProductList. Cambiar el hash suma una entrada al
  // historial, y el listener de arriba actualiza la vista.
  const verDetalle = (producto) => {
    vinoDelCatalogo.current = true;
    window.location.hash = `${PREFIJO_PRODUCTO}${producto.id}`;
  };

  // onVolver desde ProductDetail.
  const volverAlCatalogo = () => {
    if (vinoDelCatalogo.current) {
      vinoDelCatalogo.current = false;
      window.history.back();
    } else {
      // Link directo: no hay catálogo atrás en el historial, se agrega uno.
      // pushState no dispara hashchange, por eso se actualiza la vista a mano.
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      setProductoId(null);
    }
  };

  // onNavegar desde Navbar. Contacto existe en las dos vistas, pero Inicio y
  // Catálogo son del catálogo: desde el detalle primero se vuelve a la lista
  // y el scroll se hace en el useLayoutEffect, cuando ya está en el DOM.
  const navegar = (seccion) => {
    if (productoId !== null && seccion !== 'contacto') {
      seccionPendiente.current = seccion;
      scrollCatalogo.current = null;
      volverAlCatalogo();
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
    if (productoId !== null) {
      window.scrollTo(0, 0);
    } else if (seccionPendiente.current !== null) {
      irASeccion(seccionPendiente.current);
      seccionPendiente.current = null;
    } else if (scrollCatalogo.current !== null) {
      window.scrollTo(0, scrollCatalogo.current);
      scrollCatalogo.current = null;
    }
  }, [productoId]);

  return { productoId, verDetalle, volverAlCatalogo, navegar };
};

export default useNavegacion;

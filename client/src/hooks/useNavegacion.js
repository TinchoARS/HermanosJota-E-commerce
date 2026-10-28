import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const PREFIJO_PRODUCTO = 'producto-';

const leerProductoDelHash = () => {
  const coincidencia = window.location.hash.match(/^#producto-(\d+)$/);
  return coincidencia ? Number(coincidencia[1]) : null;
};

const irASeccion = (seccion) => {
  if (seccion === 'inicio') {
    window.scrollTo(0, 0);
  } else {
    document.getElementById(seccion)?.scrollIntoView();
  }
};

const useNavegacion = () => {
  const [productoId, setProductoId] = useState(leerProductoDelHash);

  const scrollCatalogo = useRef(null);

  const seccionPendiente = useRef(null);

  const vinoDelCatalogo = useRef(false);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const alCambiarHash = () => {
      const id = leerProductoDelHash();
      if (id !== null && document.getElementById('catalogo')) {
        scrollCatalogo.current = window.scrollY;
      }
      setProductoId(id);
    };
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  const verDetalle = (producto) => {
    vinoDelCatalogo.current = true;
    window.location.hash = `${PREFIJO_PRODUCTO}${producto.id}`;
  };

  const volverAlCatalogo = () => {
    if (vinoDelCatalogo.current) {
      vinoDelCatalogo.current = false;
      window.history.back();
    } else {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      setProductoId(null);
    }
  };

  const navegar = (seccion) => {
    if (productoId !== null && seccion !== 'contacto') {
      seccionPendiente.current = seccion;
      scrollCatalogo.current = null;
      volverAlCatalogo();
    } else {
      irASeccion(seccion);
    }
  };

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

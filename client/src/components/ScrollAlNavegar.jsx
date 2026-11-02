import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const posiciones = new Map();

const ScrollAlNavegar = () => {
  const { key } = useLocation();
  const tipoNavegacion = useNavigationType();

  const claveActual = useRef(key);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    const guardarPosicion = () => posiciones.set(claveActual.current, window.scrollY);
    window.addEventListener('scroll', guardarPosicion, { passive: true });
    return () => window.removeEventListener('scroll', guardarPosicion);
  }, []);

  useLayoutEffect(() => {
    claveActual.current = key;
    const posicionGuardada = tipoNavegacion === 'POP' ? posiciones.get(key) : undefined;
    window.scrollTo(0, posicionGuardada ?? 0);
  }, [key, tipoNavegacion]);

  return null;
};

export default ScrollAlNavegar;

import { useEffect, useState } from 'react';
import { listarProductos } from '../services/api';

const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const cargarProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await listarProductos(controller.signal);
        setProductos(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError('No pudimos cargar el catálogo. Revisá tu conexión e intentá de nuevo.');
        console.error(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    cargarProductos();

    return () => controller.abort();
  }, [intento]);

  const recargar = () => setIntento((n) => n + 1);

  return { productos, loading, error, recargar };
};

export default useProductos;

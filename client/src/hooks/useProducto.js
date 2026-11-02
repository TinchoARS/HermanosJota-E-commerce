import { useEffect, useState } from 'react';
import { obtenerProducto } from '../services/api';

const useProducto = (id) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [idInvalido, setIdInvalido] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const cargarProducto = async () => {
      setLoading(true);
      setError(null);
      setNoEncontrado(false);
      setIdInvalido(false);

      try {
        const data = await obtenerProducto(id, controller.signal);

        if (data === null) {
          setProducto(null);
          setNoEncontrado(true);
          return;
        }

        setProducto(data);
      } catch (err) {
        if (err.name === 'AbortError') return;

        if (err.status === 400) {
          setProducto(null);
          setIdInvalido(true);
          return;
        }

        setError('No pudimos cargar el producto. Revisá tu conexión e intentá de nuevo.');
        console.error(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    cargarProducto();

    return () => controller.abort();
  }, [id, intento]);

  const recargar = () => setIntento((n) => n + 1);

  if (!id) {
    return { producto: null, loading: false, error: null, noEncontrado: true, idInvalido: false, recargar };
  }

  return { producto, loading, error, noEncontrado, idInvalido, recargar };
};

export default useProducto;

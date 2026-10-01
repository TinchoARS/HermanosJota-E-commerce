import { useEffect, useState } from 'react';

// C3: la URL base sale de VITE_API_URL. Si no está definida queda vacía y
// el fetch va a /api/productos en el mismo origen (proxy de Vite).
const API_URL = import.meta.env.VITE_API_URL || '';

// C4 - Pide el catálogo a GET /api/productos y expone los tres estados
// (productos, loading y error) más una función para reintentar.
const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cambiar este número vuelve a disparar el useEffect (botón "Reintentar").
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Si el componente se desmonta o se reintenta antes de que llegue la
    // respuesta, se cancela la petición para no actualizar estado viejo.
    const controller = new AbortController();

    const cargarProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/productos`, { signal: controller.signal });

        // fetch solo falla si no hay red: un 404 o 500 hay que revisarlo con res.ok.
        if (!res.ok) {
          throw new Error(`El servidor respondió ${res.status}`);
        }

        const data = await res.json();
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

export { API_URL };
export default useProductos;

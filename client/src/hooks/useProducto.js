import { useEffect, useState } from 'react';
import { API_URL } from './useProductos';

// Pide UN producto a GET /api/productos/:id y devuelve la misma
// tripleta que useProductos (producto, loading, error) más un flag
// noEncontrado para poder distinguir el 404 del resto de los errores:
// un 404 significa que el producto no existe, mientras que error es un
// problema de conexión o del servidor.
//
// id puede venir como string (viene de la URL) o number (de la lista),
// por eso se manda directo en la URL sin convertir.
const useProducto = (id) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  // Cambiar este número vuelve a disparar el useEffect (botón "Reintentar").
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Sin id no hay nada que pedir: se evita el fetch a /api/productos/undefined.
    // El caso se resuelve en el return de abajo, no con setState acá, porque
    // un setState síncrono dentro de un efecto dispara un render extra.
    if (!id) return;

    // Se aborta la petición si el componente se desmonta o cambia el id
    // mientras la respuesta todavía está en camino, para no pintar un
    // producto viejo en la pantalla del nuevo.
    const controller = new AbortController();

    const cargarProducto = async () => {
      setLoading(true);
      setError(null);
      setNoEncontrado(false);

      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`, { signal: controller.signal });

        // El 404 se revisa antes que res.ok porque es el único status que
        // merece un mensaje propio en vez del error genérico.
        if (res.status === 404) {
          setProducto(null);
          setNoEncontrado(true);
          return;
        }

        if (!res.ok) {
          throw new Error(`El servidor respondió ${res.status}`);
        }

        const data = await res.json();
        setProducto(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
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

  // Si nunca vino un id se trata igual que un 404. App solo monta el detalle
  // con un producto elegido, así que es una defensa: si el hook se usara solo,
  // el componente no quedaría girando en el spinner para siempre.
  if (!id) {
    return { producto: null, loading: false, error: null, noEncontrado: true, recargar };
  }

  return { producto, loading, error, noEncontrado, recargar };
};

export default useProducto;

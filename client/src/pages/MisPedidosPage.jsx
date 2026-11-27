import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { misPedidos } from '../services/api';
import formatPrice from '../utils/formatPrice';
import mensajeError from '../utils/mensajeError';

const formatearFecha = (fechaIso) => {
  if (!fechaIso) return 'Fecha no disponible';
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return 'Fecha no disponible';
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;

    const cargarPedidos = async () => {
      try {
        setCargando(true);
        setError('');
        const respuesta = await misPedidos();
        // Soporta tanto array directo [...] como { pedidos: [...] }
        const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.pedidos ?? []);
        if (activo) {
          setPedidos(lista);
        }
      } catch (err) {
        if (activo) {
          if (err.status === 401) {
            logout();
            navigate('/login', { replace: true });
            return;
          }
          setError(mensajeError(err, 'No pudimos cargar tus pedidos. Intentá de nuevo.'));
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPedidos();
    return () => {
      activo = false;
    };
  }, [logout, navigate]);

  return (
    <section className="pedidos-page">
      <div className="pedidos-cabecera">
        <h1>Mis pedidos</h1>
        <p className="pedidos-subtitulo">Historial de compras realizadas con tu cuenta</p>
      </div>

      {error && (
        <div className="error-mensaje" role="alert">
          {error}
        </div>
      )}

      {cargando ? (
        <p role="status">Cargando tu historial de pedidos...</p>
      ) : pedidos.length === 0 && !error ? (
        <div className="pedidos-vacio">
          <p>Todavía no realizaste ningún pedido.</p>
          <Link to="/productos" className="btn btn-primario">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => {
            const numeroPedido = pedido._id ? `#${pedido._id.slice(-6).toUpperCase()}` : 'Pedido';
            const totalCalculado =
              pedido.total ??
              (pedido.items || []).reduce(
                (acc, item) => acc + (item.precioUnitario ?? item.precio ?? 0) * item.cantidad,
                0
              );

            return (
              <article key={pedido._id} className="pedido-card">
                <header className="pedido-card__cabecera">
                  <div>
                    <h2 className="pedido-card__numero">Pedido {numeroPedido}</h2>
                    <p className="pedido-card__fecha">{formatearFecha(pedido.createdAt)}</p>
                  </div>
                  {pedido.estado && (
                    <span className="pedido-card__estado">{pedido.estado}</span>
                  )}
                </header>

                <ul className="pedido-card__items">
                  {(pedido.items || []).map((item, idx) => {
                    const nombre =
                      item.nombre || item.producto?.nombre || 'Producto del catálogo';
                    const precioUnit =
                      item.precioUnitario ?? item.precio ?? item.producto?.precio ?? 0;

                    return (
                      <li key={item._id || item.producto?._id || idx} className="pedido-card__item">
                        <span className="pedido-card__item-nombre">
                          {nombre} <strong>× {item.cantidad}</strong>
                        </span>
                        <span className="pedido-card__item-subtotal">
                          {formatPrice(precioUnit * item.cantidad)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <footer className="pedido-card__pie">
                  <span>Total abonado</span>
                  <strong>{formatPrice(totalCalculado)}</strong>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
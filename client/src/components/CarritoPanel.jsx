import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../services/api';
import formatPrice from '../utils/formatPrice';
import mensajeError from '../utils/mensajeError';

const CarritoPanel = ({
  items,
  cantidad,
  total,
  onCambiarCantidad,
  onQuitar,
  onFinalizarCompra,
  onRecargarCatalogo,
  onCerrar,
}) => {
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorCompra, setErrorCompra] = useState('');

  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const finalizarCompra = async () => {
    if (enviando || items.length === 0) return;

    // 1. Si no hay sesión activa, redirigir a /login conservando el carrito
    if (!usuario) {
      onCerrar();
      navigate('/login', { state: { from: location } });
      return;
    }

    // 2. Enviar pedido autenticado al backend
    setEnviando(true);
    setErrorCompra('');
    try {
      const itemsPayload = items.map((item) => ({
        producto: item._id,
        cantidad: item.cantidad,
      }));

      const respuesta = await crearPedido(itemsPayload);
      const pedido = respuesta?.pedido ?? respuesta;

      onFinalizarCompra();
      onRecargarCatalogo?.();
      setPedidoConfirmado(pedido);
    } catch (err) {
      if (err.status === 401) {
        logout();
        onCerrar();
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }
      setErrorCompra(mensajeError(err, 'No pudimos procesar tu compra. Intentá nuevamente.'));
    } finally {
      setEnviando(false);
    }
  };

  const contenido = () => {
    if (pedidoConfirmado) {
      return (
        <div className="carrito-panel__confirmacion" role="status">
          <p className="carrito-panel__mensaje">
            ¡Compra registrada con éxito! Gracias por elegir Hermanos Jota.
          </p>
          {pedidoConfirmado._id && (
            <p className="carrito-panel__pedido-id">
              N.º de pedido: <strong>#{pedidoConfirmado._id.slice(-6).toUpperCase()}</strong>
            </p>
          )}
          <Link
            to="/mis-pedidos"
            className="btn btn-primario carrito-panel__finalizar"
            onClick={onCerrar}
          >
            Ver mis pedidos
          </Link>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <p className="carrito-panel__mensaje">
          Todavía no agregaste productos. Podés sumarlos desde el catálogo.
        </p>
      );
    }

    return (
      <>
        <ul className="carrito-panel__lista">
          {items.map((item) => (
            <li key={item._id} className="carrito-panel__item">
              <div className="carrito-panel__fila">
                <span className="carrito-panel__nombre">{item.nombre}</span>
                <span className="carrito-panel__precio">
                  {formatPrice(item.precio * item.cantidad)}
                </span>
              </div>

              <div className="carrito-panel__fila">
                <div className="cantidad" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                  <button
                    type="button"
                    className="cantidad__btn"
                    onClick={() => onCambiarCantidad(item._id, -1)}
                    disabled={enviando}
                    aria-label={`Quitar una unidad de ${item.nombre}`}
                  >
                    −
                  </button>
                  <span className="cantidad__valor" aria-live="polite">{item.cantidad}</span>
                  <button
                    type="button"
                    className="cantidad__btn"
                    onClick={() => onCambiarCantidad(item._id, 1)}
                    disabled={enviando || item.cantidad >= item.stock}
                    aria-label={`Sumar una unidad de ${item.nombre}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="carrito-panel__quitar"
                  onClick={() => onQuitar(item._id)}
                  disabled={enviando}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="carrito-panel__total">
          <span>Total de la compra</span>
          <span>{formatPrice(total)}</span>
        </div>

        {errorCompra && (
          <p className="form-error" role="alert">
            {errorCompra}
          </p>
        )}

        <button
          type="button"
          className="btn btn-primario carrito-panel__finalizar"
          onClick={finalizarCompra}
          disabled={enviando}
        >
          {enviando
            ? 'Procesando compra...'
            : usuario
              ? 'Finalizar compra'
              : 'Ingresar para comprar'}
        </button>
      </>
    );
  };

  return (
    <div className="carrito-panel">
      <div className="carrito-panel__cabecera">
        <h2 className="carrito-panel__titulo">
          Tu carrito{cantidad > 0 && ` (${cantidad})`}
        </h2>
        <button
          type="button"
          className="carrito-panel__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar el carrito"
        >
          ×
        </button>
      </div>

      {contenido()}
    </div>
  );
};

export default CarritoPanel;
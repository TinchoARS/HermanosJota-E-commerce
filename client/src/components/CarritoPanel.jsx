import { useState } from 'react';

// Mismo formato que usan ProductCard y ProductDetail para no mostrar precios
// con decimales.
const formatearPrecio = (precio) =>
  precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// Panel desplegable del carrito. Lo abre y lo cierra Navbar; los datos y las
// acciones llegan por props desde useCarrito (vía App y Navbar).
const CarritoPanel = ({ items, cantidad, total, onCambiarCantidad, onQuitar, onFinalizarCompra, onCerrar }) => {
  // La compra es simulada: al finalizar se vacía el carrito y se muestra un
  // agradecimiento. Es estado del panel, así que al cerrarlo y volver a
  // abrirlo arranca de nuevo.
  const [compraFinalizada, setCompraFinalizada] = useState(false);

  const finalizarCompra = () => {
    onFinalizarCompra();
    setCompraFinalizada(true);
  };

  const contenido = () => {
    if (compraFinalizada) {
      return (
        <p className="carrito-panel__mensaje" role="status">
          ¡Gracias por tu compra! Te vamos a escribir para coordinar el pago y la entrega.
        </p>
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
            // Un solo registro por producto: la cantidad se cambia con los
            // botones y el precio de la línea es precio × cantidad.
            <li key={item.id} className="carrito-panel__item">
              <div className="carrito-panel__fila">
                <span className="carrito-panel__nombre">{item.nombre}</span>
                <span className="carrito-panel__precio">
                  {formatearPrecio(item.precio * item.cantidad)}
                </span>
              </div>

              <div className="carrito-panel__fila">
                <div className="cantidad" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                  <button
                    type="button"
                    className="cantidad__btn"
                    onClick={() => onCambiarCantidad(item.id, -1)}
                    aria-label={`Quitar una unidad de ${item.nombre}`}
                  >
                    −
                  </button>
                  <span className="cantidad__valor" aria-live="polite">{item.cantidad}</span>
                  <button
                    type="button"
                    className="cantidad__btn"
                    onClick={() => onCambiarCantidad(item.id, 1)}
                    aria-label={`Sumar una unidad de ${item.nombre}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="carrito-panel__quitar"
                  onClick={() => onQuitar(item.id)}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="carrito-panel__total">
          <span>Total de la compra</span>
          <span>{formatearPrecio(total)}</span>
        </div>

        <button type="button" className="btn btn-primario carrito-panel__finalizar" onClick={finalizarCompra}>
          Finalizar compra
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

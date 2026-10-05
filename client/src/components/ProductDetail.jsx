import { useState } from 'react';
import { API_URL } from '../hooks/useProductos';
import useProducto from '../hooks/useProducto';
// catalogo.css se importa acá también porque trae los estilos compartidos
// (.btn, .btn-primario, .spinner, .catalogo-estado) y Vite solo carga el CSS
// de los componentes que están montados: como ProductList se desmonta al ver
// el detalle, sin este import los botones quedarían sin estilo.
import '../styles/catalogo.css';
import '../styles/producto-detalle.css';

// Tope del selector de cantidad. Es una mueblería: nadie compra 100 sillones
// de una vez, y un límite evita números absurdos en el carrito.
const CANTIDAD_MAXIMA = 10;

// Vista de detalle de un producto.
// Recibe el id del producto (sale de la URL), el producto de la lista si ya
// estaba cargado (productoInicial) y los callbacks que ejecuta App.jsx:
// onVolver para regresar al catálogo y onAgregar para sumar al carrito.
const ProductDetail = ({ id, productoInicial, onVolver, onAgregar }) => {
  // Los datos definitivos vienen de GET /api/productos/:id, no de la lista.
  const { producto: detalle, error, noEncontrado, recargar } = useProducto(id);

  // Mientras llega la respuesta se muestra lo que ya vino en la lista, así el
  // detalle aparece al instante en vez de pasar por el spinner. Si se entra
  // por un link directo todavía no hay lista, y ahí sí se espera a la API.
  const datos = detalle ?? productoInicial;

  // Cantidad a agregar. App monta el detalle con key={id}, así que al pasar
  // a otro producto el componente arranca de nuevo y la cantidad vuelve a 1.
  const [cantidad, setCantidad] = useState(1);

  // El botón "Volver" tiene que estar disponible en todos los estados,
  // si no el usuario queda atrapado si la API falla.
  const botonVolver = (
    <button type="button" className="btn btn-secundario" onClick={onVolver}>
      Volver al catálogo
    </button>
  );

  // El backend respondió 404: el producto ya no existe. Va primero porque,
  // aunque la lista lo tuviera, la API confirma que ya no está.
  if (noEncontrado) {
    return (
      <section className="catalogo-estado" role="alert">
        <h2 className="catalogo-titulo">Producto no encontrado</h2>
        <p>El producto que buscás no existe o ya no está disponible.</p>
        {botonVolver}
      </section>
    );
  }

  // Falló la conexión o el servidor devolvió algo distinto de 200, y no hay
  // datos de la lista para mostrar en su lugar.
  if (error && !datos) {
    return (
      <section className="catalogo-estado" role="alert">
        <p>{error}</p>
        <div className="producto-detalle__acciones">
          <button type="button" className="btn btn-primario" onClick={recargar}>
            Reintentar
          </button>
          {botonVolver}
        </div>
      </section>
    );
  }

  if (!datos) {
    return (
      <section className="catalogo-estado" role="status">
        <span className="spinner" aria-hidden="true"></span>
        <p>Cargando producto…</p>
        {botonVolver}
      </section>
    );
  }

  const { nombre, descripcion, precio, imagen } = datos;

  const agregar = () => {
    onAgregar(datos, cantidad);
    setCantidad(1);
  };

  return (
    <section className="producto-detalle">
      {/* Miga de pan: muestra dónde está el usuario y da otro camino de vuelta. */}
      <nav className="producto-detalle__miga" aria-label="Ubicación">
        <ol>
          <li>
            <button type="button" className="producto-detalle__miga-link" onClick={onVolver}>
              Catálogo
            </button>
          </li>
          <li aria-current="page">{nombre}</li>
        </ol>
      </nav>

      <div className="producto-detalle__imagen">
        <img
          src={`${API_URL}/${encodeURI(imagen)}`}
          alt={nombre}
          className="producto-detalle__img"
        />
      </div>

      <div className="producto-detalle__info">
        <h1 className="producto-detalle__nombre">{nombre}</h1>
        <p className="producto-detalle__precio">
          {precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
        </p>

        <div className="producto-detalle__seccion">
          <h2>Descripción</h2>
          <p>{descripcion}</p>
        </div>

        <div className="producto-detalle__compra">
          <span className="producto-detalle__cantidad-label" id="cantidad-label">Cantidad</span>
          <div className="cantidad cantidad--grande" role="group" aria-labelledby="cantidad-label">
            <button
              type="button"
              className="cantidad__btn"
              onClick={() => setCantidad((n) => n - 1)}
              disabled={cantidad <= 1}
              aria-label="Restar una unidad"
            >
              −
            </button>
            <span className="cantidad__valor" aria-live="polite">{cantidad}</span>
            <button
              type="button"
              className="cantidad__btn"
              onClick={() => setCantidad((n) => n + 1)}
              disabled={cantidad >= CANTIDAD_MAXIMA}
              aria-label="Sumar una unidad"
            >
              +
            </button>
          </div>
        </div>

        <div className="producto-detalle__acciones">
          <button type="button" className="btn btn-primario" onClick={agregar}>
            Agregar al carrito
          </button>
          {botonVolver}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

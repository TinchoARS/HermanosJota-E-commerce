import { API_URL } from '../hooks/useProductos';
import useProducto from '../hooks/useProducto';
// catalogo.css se importa acá también porque trae los estilos compartidos
// (.btn, .btn-primario, .spinner, .catalogo-estado) y Vite solo carga el CSS
// de los componentes que están montados: como ProductList se desmonta al ver
// el detalle, sin este import los botones quedarían sin estilo.
import '../styles/catalogo.css';
import '../styles/producto-detalle.css';

// Vista de detalle de un producto.
// Recibe el producto que venía en la lista (de ahí saca el id para pedirlo
// de nuevo a la API) y los callbacks que ejecuta App.jsx: onVolver para
// regresar al catálogo y onAgregar para sumar al carrito.
const ProductDetail = ({ producto, onVolver, onAgregar }) => {
  // Los datos definitivos vienen de GET /api/productos/:id, no de la lista.
  const { producto: detalle, loading, error, noEncontrado, recargar } = useProducto(producto?.id);

  // El botón "Volver" tiene que estar disponible en todos los estados,
  // si no el usuario queda atrapado si la API falla.
  const botonVolver = (
    <button type="button" className="btn btn-secundario" onClick={onVolver}>
      Volver al catálogo
    </button>
  );

  // El backend respondió 404: el producto ya no existe.
  if (noEncontrado) {
    return (
      <section className="catalogo-estado" role="alert">
        <h2 className="catalogo-titulo">Producto no encontrado</h2>
        <p>El producto que buscás no existe o ya no está disponible.</p>
        {botonVolver}
      </section>
    );
  }

  // Falló la conexión o el servidor devolvió algo distinto de 200.
  if (error) {
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

  if (loading || !detalle) {
    return (
      <section className="catalogo-estado" role="status">
        <span className="spinner" aria-hidden="true"></span>
        <p>Cargando producto…</p>
        {botonVolver}
      </section>
    );
  }

  const { nombre, descripcion, precio, imagen } = detalle;

  return (
    <section className="producto-detalle">
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

        <div className="producto-detalle__acciones">
          <button
            type="button"
            className="btn btn-primario"
            onClick={() => onAgregar(detalle)}
          >
            Agregar al carrito
          </button>
          {botonVolver}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

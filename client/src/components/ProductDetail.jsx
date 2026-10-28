import { useState } from 'react';
import useProducto from '../hooks/useProducto';
import { urlImagen } from '../services/productos';
import formatPrice from '../utils/formatPrice';
import '../styles/catalogo.css';
import '../styles/producto-detalle.css';

const CANTIDAD_MAXIMA = 10;

const ProductDetail = ({ id, productoInicial, onVolver, onAgregar }) => {
  const { producto: detalle, error, noEncontrado, recargar } = useProducto(id);

  const datos = detalle ?? productoInicial;

  const [cantidad, setCantidad] = useState(1);

  const botonVolver = (
    <button type="button" className="btn btn-secundario" onClick={onVolver}>
      Volver al catálogo
    </button>
  );

  if (noEncontrado) {
    return (
      <section className="catalogo-estado" role="alert">
        <h2 className="catalogo-titulo">Producto no encontrado</h2>
        <p>El producto que buscás no existe o ya no está disponible.</p>
        {botonVolver}
      </section>
    );
  }

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
          src={urlImagen(imagen)}
          alt={nombre}
          className="producto-detalle__img"
        />
      </div>

      <div className="producto-detalle__info">
        <h1 className="producto-detalle__nombre">{nombre}</h1>
        <p className="producto-detalle__precio">
          {formatPrice(precio)}
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

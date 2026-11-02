import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProducto from '../hooks/useProducto';
import { urlImagen } from '../services/api';
import formatPrice from '../utils/formatPrice';
import mensajeError from '../utils/mensajeError';
import textoStock from '../utils/textoStock';
import '../styles/catalogo.css';
import '../styles/producto-detalle.css';

const CANTIDAD_MAXIMA = 10;

const ProductDetail = ({ id, productoInicial, enCarrito = 0, onAgregar, onEliminar }) => {
  const { producto: detalle, error, noEncontrado, idInvalido, recargar } = useProducto(id);
  const navigate = useNavigate();

  const datos = detalle ?? productoInicial;
  const [cantidad, setCantidad] = useState(1);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);

  const botonVolver = (
    <Link to="/productos" className="btn btn-secundario">
      Volver al catálogo
    </Link>
  );

  if (idInvalido) {
    return (
      <section className="catalogo-estado" role="alert">
        <h2 className="catalogo-titulo">Producto no válido</h2>
        <p>La dirección que abriste no corresponde a ningún producto. Revisala o volvé al catálogo.</p>
        {botonVolver}
      </section>
    );
  }

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

  const { nombre, descripcion, precio, imagenUrl, stock = 0 } = datos;
  const sinStock = stock === 0;
  const disponible = stock - enCarrito;
  const sinDisponible = disponible <= 0;
  const cantidadMaxima = Math.max(1, Math.min(CANTIDAD_MAXIMA, disponible));

  const agregar = () => {
    if (sinDisponible) return;
    onAgregar(datos, cantidad);
    setCantidad(1);
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este producto?')) return;

    setEliminando(true);
    setErrorEliminar(null);
    try {
      await onEliminar();
      navigate('/productos');
    } catch (err) {
      setErrorEliminar(mensajeError(err, 'No pudimos eliminar el producto. Intentá de nuevo.'));
      setEliminando(false);
    }
  };

  return (
    <section className="producto-detalle">
      <nav className="producto-detalle__miga" aria-label="Ubicación">
        <ol>
          <li>
            <Link to="/productos" className="producto-detalle__miga-link">
              Catálogo
            </Link>
          </li>
          <li aria-current="page">{nombre}</li>
        </ol>
      </nav>

      <div className="producto-detalle__imagen">
        <img
          src={urlImagen(imagenUrl)}
          alt={nombre}
          className="producto-detalle__img"
        />
      </div>

      <div className="producto-detalle__info">
        <h1 className="producto-detalle__nombre">{nombre}</h1>
        <p className="producto-detalle__precio">
          {formatPrice(precio)}
        </p>
        <p className={`producto-detalle__stock${sinStock ? ' producto-detalle__stock--agotado' : ''}`}>
          {textoStock(stock, enCarrito)}
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
              disabled={sinDisponible || cantidad <= 1}
              aria-label="Restar una unidad"
            >
              −
            </button>
            <span className="cantidad__valor" aria-live="polite">{cantidad}</span>
            <button
              type="button"
              className="cantidad__btn"
              onClick={() => setCantidad((n) => n + 1)}
              disabled={sinDisponible || cantidad >= cantidadMaxima}
              aria-label="Sumar una unidad"
            >
              +
            </button>
          </div>
        </div>

        <div className="producto-detalle__acciones">
          <button type="button" className="btn btn-primario" onClick={agregar} disabled={sinDisponible}>
            Agregar al carrito
          </button>
          {botonVolver}
          <Link to={`/admin/editar-producto/${id}`} className="btn btn-secundario">
            Editar
          </Link>
          <button
            type="button"
            className="btn btn-peligro"
            onClick={handleEliminar}
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>

        {errorEliminar && (
          <p className="producto-detalle__error" role="alert">{errorEliminar}</p>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
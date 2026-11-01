import { Link } from 'react-router-dom';
import { urlImagen } from '../services/api';
import formatPrice from '../utils/formatPrice';
import textoStock from '../utils/textoStock';

const ProductCard = ({ producto, enCarrito = 0, onAgregar }) => {
  const { _id, nombre, precio, imagenUrl, stock = 0 } = producto;
  const rutaDetalle = `/productos/${_id}`;
  const sinStock = stock === 0;
  const sinDisponible = enCarrito >= stock;

  return (
    <article className="product-card">
      <Link to={rutaDetalle}>
        <img
          src={urlImagen(imagenUrl)}
          alt={nombre}
          className="product-card-img"
          loading="lazy"
        />
      </Link>

      <div className="product-card-body">
        <h3 className="product-card-nombre">
          <Link to={rutaDetalle}>{nombre}</Link>
        </h3>
        <p className="product-card-precio">
          {formatPrice(precio)}
        </p>
        <p className={`product-card-stock${sinStock ? ' product-card-stock--agotado' : ''}`}>
          {textoStock(stock, enCarrito)}
        </p>

        <div className="product-card-acciones">
          <Link to={rutaDetalle} className="btn btn-secundario">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-primario"
            onClick={() => onAgregar(producto)}
            disabled={sinDisponible}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

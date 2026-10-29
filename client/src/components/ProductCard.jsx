import { Link } from 'react-router-dom';
import { urlImagen } from '../services/api';
import formatPrice from '../utils/formatPrice';

const ProductCard = ({ producto, onAgregar }) => {
  const { _id, nombre, precio, imagenUrl } = producto;
  const rutaDetalle = `/productos/${_id}`;

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

        <div className="product-card-acciones">
          <Link to={rutaDetalle} className="btn btn-secundario">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-primario"
            onClick={() => onAgregar(producto)}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

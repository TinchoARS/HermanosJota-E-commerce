import { urlImagen } from '../services/productos';
import formatPrice from '../utils/formatPrice';

const ProductCard = ({ producto, onSeleccionar, onAgregar }) => {
  const { nombre, precio, imagen } = producto;

  return (
    <article className="product-card">
      <img
        src={urlImagen(imagen)}
        alt={nombre}
        className="product-card-img"
        loading="lazy"
        onClick={() => onSeleccionar(producto)}
      />

      <div className="product-card-body">
        <h3
          className="product-card-nombre"
          onClick={() => onSeleccionar(producto)}
        >
          {nombre}
        </h3>
        <p className="product-card-precio">
          {formatPrice(precio)}
        </p>

        <div className="product-card-acciones">
          <button
            type="button"
            className="btn btn-secundario"
            onClick={() => onSeleccionar(producto)}
          >
            Ver detalle
          </button>
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

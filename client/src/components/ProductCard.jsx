import { API_URL } from '../hooks/useProductos';

// F5 - Tarjeta de un producto del catálogo.
// imagen viene como ruta relativa ("catalogo/Aparador Uspallata.png"), por
// eso se arma la URL completa contra la API y se codifican los espacios.
const ProductCard = ({ producto, onSeleccionar, onAgregar }) => {
  const { nombre, precio, imagen } = producto;

  return (
    <article className="product-card">
      <img
        src={`${API_URL}/${encodeURI(imagen)}`}
        alt={nombre}
        className="product-card-img"
        loading="lazy"
      />

      <div className="product-card-body">
        <h3 className="product-card-nombre">{nombre}</h3>
        <p className="product-card-precio">
          {precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
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

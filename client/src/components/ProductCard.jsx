import { API_URL } from '../hooks/useProductos';

// Tarjeta de un producto del catálogo.
// imagen viene como ruta relativa ("catalogo/aparador-uspallata.png"), por
// eso se arma la URL completa contra la API.
const ProductCard = ({ producto, onSeleccionar, onAgregar }) => {
  const { nombre, precio, imagen } = producto;

  return (
    <article className="product-card">
      <img
        src={`${API_URL}/${encodeURI(imagen)}`}
        alt={nombre}
        className="product-card-img"
        loading="lazy"
        onClick={() => onSeleccionar(producto)} // <-- Se agregó el evento click a la imagen
      />

      <div className="product-card-body">
        <h3 
          className="product-card-nombre" 
          onClick={() => onSeleccionar(producto)} // <-- Se agregó el evento click al título
        >
          {nombre}
        </h3>
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
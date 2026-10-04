import ProductCard from './ProductCard';
import '../styles/catalogo.css';

// Grilla del catálogo con sus estados de carga, error y vacío.
// loading, error y onReintentar son opcionales: si no se pasan, el
// componente solo renderiza la lista que recibe.
const ProductList = ({ productos, onSeleccionar, onAgregar, loading = false, error = null, onReintentar }) => {
  if (loading) {
    return (
      <div className="catalogo-estado" role="status">
        <span className="spinner" aria-hidden="true"></span>
        <p>Cargando…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalogo-estado" role="alert">
        <p>{error}</p>
        {onReintentar && (
          <button type="button" className="btn btn-primario" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="catalogo-estado">
        <p>Todavía no hay productos en el catálogo.</p>
      </div>
    );
  }

  return (
    <section className="catalogo">
      <h2 className="catalogo-titulo">Catálogo</h2>
      <div className="catalogo-grilla">
        {productos.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            onSeleccionar={onSeleccionar}
            onAgregar={onAgregar}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;

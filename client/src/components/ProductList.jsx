import { useEffect } from 'react';
import ProductCard from './ProductCard';
import '../styles/catalogo.css';

// Grilla del catálogo con sus estados de carga, error y vacío.
// loading, error y onReintentar son opcionales: si no se pasan, el
// componente solo renderiza la lista que recibe.
const ProductList = ({ productos, onSeleccionar, onAgregar, loading = false, error = null, onReintentar }) => {

  // Este useEffect vigila cuándo aparecen las tarjetas al hacer scroll
  useEffect(() => {
    // Si está cargando, hay error o no hay productos, el observer no hace falta
    if (loading || error || productos.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Activa la animación un poquito antes de llegar al borde inferior
      threshold: 0.1 // Se dispara cuando al menos el 10% de la tarjeta es visible
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          observer.unobserve(entry.target); // Deja de vigilarla una vez que ya apareció
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      // Las oculta por defecto para que la animación funcione correctamente al scrollear
      card.classList.add('scroll-hidden');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [productos, loading, error]);

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
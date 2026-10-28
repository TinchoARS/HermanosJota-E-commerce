import { useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import '../styles/catalogo.css';

const ORDENES = [
  { valor: 'destacados', texto: 'Destacados' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
  { valor: 'nombre', texto: 'Nombre: A a Z' },
];

const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ordenar = (lista, orden) => {
  const copia = [...lista];
  if (orden === 'precio-asc') return copia.sort((a, b) => a.precio - b.precio);
  if (orden === 'precio-desc') return copia.sort((a, b) => b.precio - a.precio);
  if (orden === 'nombre') return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return copia;
};

const ProductList = ({
  productos,
  onSeleccionar,
  onAgregar,
  loading = false,
  error = null,
  onReintentar,
  filtros = { busqueda: '', orden: 'destacados' },
  onCambiarFiltros = () => {},
}) => {
  const { busqueda, orden } = filtros;

  const productosVisibles = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    const filtrados = termino
      ? productos.filter((p) => normalizar(p.nombre).includes(termino))
      : productos;
    return ordenar(filtrados, orden);
  }, [productos, busqueda, orden]);

  useEffect(() => {
    if (loading || error || productosVisibles.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const cards = document.querySelectorAll('.product-card:not(.scroll-visible)');

    cards.forEach(card => {
      card.classList.add('scroll-hidden');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [productosVisibles, loading, error]);

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

      <div className="catalogo-controles">
        <label className="catalogo-control catalogo-control--busqueda">
          <span className="sr-only">Buscar productos</span>
          <input
            type="search"
            placeholder="Buscar muebles…"
            value={busqueda}
            onChange={(e) => onCambiarFiltros({ ...filtros, busqueda: e.target.value })}
          />
        </label>

        <label className="catalogo-control">
          <span className="catalogo-control__texto">Ordenar por</span>
          <select
            value={orden}
            onChange={(e) => onCambiarFiltros({ ...filtros, orden: e.target.value })}
          >
            {ORDENES.map(({ valor, texto }) => (
              <option key={valor} value={valor}>{texto}</option>
            ))}
          </select>
        </label>

        <p className="catalogo-resultados" aria-live="polite">
          {productosVisibles.length === 1 ? '1 producto' : `${productosVisibles.length} productos`}
        </p>
      </div>

      {productosVisibles.length === 0 ? (
        <div className="catalogo-estado">
          <p>No encontramos productos para “{busqueda.trim()}”.</p>
          <button
            type="button"
            className="btn btn-secundario"
            onClick={() => onCambiarFiltros({ ...filtros, busqueda: '' })}
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className="catalogo-grilla">
          {productosVisibles.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              onSeleccionar={onSeleccionar}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;

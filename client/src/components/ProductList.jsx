import { useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import '../styles/catalogo.css';

// Opciones del selector de orden. "destacados" respeta el orden de la API.
const ORDENES = [
  { valor: 'destacados', texto: 'Destacados' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
  { valor: 'nombre', texto: 'Nombre: A a Z' },
];

// Pasa a minúsculas y saca los acentos, así "cordoba" encuentra "Córdoba".
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ordenar = (lista, orden) => {
  const copia = [...lista];
  if (orden === 'precio-asc') return copia.sort((a, b) => a.precio - b.precio);
  if (orden === 'precio-desc') return copia.sort((a, b) => b.precio - a.precio);
  if (orden === 'nombre') return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return copia;
};

// Grilla del catálogo con sus estados de carga, error y vacío, y la barra de
// búsqueda y orden.
// loading, error y onReintentar son opcionales: si no se pasan, el
// componente solo renderiza la lista que recibe.
// filtros y onCambiarFiltros vienen de App: si el estado viviera acá se
// perdería al entrar a un detalle, porque ProductList se desmonta.
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

  // Este useEffect vigila cuándo aparecen las tarjetas al hacer scroll
  useEffect(() => {
    // Si está cargando, hay error o no hay productos, el observer no hace falta
    if (loading || error || productosVisibles.length === 0) return;

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
    // Solo las que todavía no aparecieron: al buscar u ordenar, las tarjetas
    // que ya estaban a la vista no repiten la animación en cada tecla.
    const cards = document.querySelectorAll('.product-card:not(.scroll-visible)');

    cards.forEach(card => {
      // Las oculta por defecto para que la animación funcione correctamente al scrollear
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

        {/* aria-live: el lector de pantalla anuncia cuántos resultados quedan. */}
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

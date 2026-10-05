import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.svg';

// Secciones a las que lleva el menú. El id es el del elemento destino.
const SECCIONES = [
  { id: 'inicio', texto: 'INICIO' },
  { id: 'catalogo', texto: 'CATÁLOGO' },
  { id: 'contacto', texto: 'CONTACTO' },
];

// Mismo formato que usan ProductCard y ProductDetail para no mostrar precios
// con decimales.
const formatearPrecio = (precio) =>
  precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const Navbar = ({ cantidadCarrito, itemsCarrito = [], totalCarrito = 0, onNavegar }) => {
  // Si el panel del carrito está desplegado. Es estado solo de la vista, así que
  // vive acá y no en App: los datos del carrito siguen llegando por props.
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const contenedorCarrito = useRef(null);

  // La app no tiene router: el catálogo y el detalle son vistas de App.jsx.
  // Un href="#catalogo" pelado no funciona desde el detalle porque ese id no
  // está montado, así que se deja que App decida (volver al catálogo y
  // después scrollear). El href queda para abrir en otra pestaña o copiar.
  const handleClick = (e, seccion) => {
    e.preventDefault();
    onNavegar(seccion);
  };

  // Cierra el panel al hacer clic fuera de él. El botón está dentro del
  // contenedor, así que el toggle no lo dispara este listener.
  useEffect(() => {
    if (!carritoAbierto) return;
    const handleClickFuera = (e) => {
      if (contenedorCarrito.current && !contenedorCarrito.current.contains(e.target)) {
        setCarritoAbierto(false);
      }
    };
    document.addEventListener('click', handleClickFuera);
    return () => document.removeEventListener('click', handleClickFuera);
  }, [carritoAbierto]);

  return (
    <nav className="navbar">
      <a 
        href="#inicio" 
        className="navbar-logo-container"
        onClick={(e) => handleClick(e, 'inicio')}
      >
        <img src={logo} alt="Logo Hermanos Jota" className="navbar-logo-img" />
        <span className="navbar-brand-text">HERMANOS JOTA</span>
      </a>

      {/* El carrito va en el medio del header: el grid de 3 columnas lo centra
          entre el logo (izquierda) y el menú (derecha). */}
      <div className="navbar-carrito" ref={contenedorCarrito}>
        <button
          className="navbar-cart-btn"
          onClick={() => setCarritoAbierto((abierto) => !abierto)}
          aria-expanded={carritoAbierto}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="navbar-cart-label">Carrito</span>
          {/* Badge flotante con la cantidad de unidades */}
          <span className="cart-badge">{cantidadCarrito}</span>
        </button>

        {carritoAbierto && (
          <div className="carrito-panel">
            <div className="carrito-panel__cabecera">
              <h2 className="carrito-panel__titulo">
                Tu carrito{cantidadCarrito > 0 && ` (${cantidadCarrito})`}
              </h2>
              <button
                type="button"
                className="carrito-panel__cerrar"
                onClick={() => setCarritoAbierto(false)}
                aria-label="Cerrar el carrito"
              >
                ×
              </button>
            </div>

            {itemsCarrito.length === 0 ? (
              <p className="carrito-panel__vacio">
                Todavía no agregaste productos. Podés Sumar desde el catálogo.
              </p>
            ) : (
              <>
                <ul className="carrito-panel__lista">
                  {itemsCarrito.map((item) => (
                    // Un solo registro por producto: la cantidad se muestra
                    // como "× N" y el precio de la línea es precio × cantidad.
                    <li key={item.id} className="carrito-panel__item">
                      <span className="carrito-panel__nombre">
                        {item.nombre}
                        <span className="carrito-panel__cantidad">× {item.cantidad}</span>
                      </span>
                      <span className="carrito-panel__precio">
                        {formatearPrecio(item.precio * item.cantidad)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="carrito-panel__total">
                  <span>Total de la compra</span>
                  <span>{formatearPrecio(totalCarrito)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <ul className="navbar-links">
        {SECCIONES.map(({ id, texto }) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => handleClick(e, id)}>{texto}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
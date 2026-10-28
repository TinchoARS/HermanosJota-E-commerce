import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.svg';
import CarritoPanel from './CarritoPanel';

const SECCIONES = [
  { id: 'inicio', texto: 'INICIO' },
  { id: 'catalogo', texto: 'CATÁLOGO' },
  { id: 'contacto', texto: 'CONTACTO' },
];

const Navbar = ({
  cantidadCarrito,
  itemsCarrito = [],
  totalCarrito = 0,
  onNavegar,
  onCambiarCantidad,
  onQuitarDelCarrito,
  onFinalizarCompra,
}) => {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const contenedorCarrito = useRef(null);
  const botonCarrito = useRef(null);

  const [scrolleado, setScrolleado] = useState(false);

  useEffect(() => {
    const actualizar = () => setScrolleado(window.scrollY > 8);
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    return () => window.removeEventListener('scroll', actualizar);
  }, []);

  const handleClick = (e, seccion) => {
    e.preventDefault();
    onNavegar(seccion);
  };

  useEffect(() => {
    if (!carritoAbierto) return;
    const handleClickFuera = (e) => {
      if (contenedorCarrito.current && !contenedorCarrito.current.contains(e.target)) {
        setCarritoAbierto(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setCarritoAbierto(false);
        botonCarrito.current?.focus();
      }
    };
    document.addEventListener('pointerdown', handleClickFuera);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleClickFuera);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [carritoAbierto]);

  return (
    <nav className={`navbar${scrolleado ? ' navbar--scrolleado' : ''}`}>
      <a 
        href="#inicio" 
        className="navbar-logo-container"
        onClick={(e) => handleClick(e, 'inicio')}
      >
        <img src={logo} alt="Logo Hermanos Jota" className="navbar-logo-img" />
        <span className="navbar-brand-text">HERMANOS JOTA</span>
      </a>

      <div className="navbar-carrito" ref={contenedorCarrito}>
        <button
          ref={botonCarrito}
          className="navbar-cart-btn"
          onClick={() => setCarritoAbierto((abierto) => !abierto)}
          aria-expanded={carritoAbierto}
          aria-label={`Carrito, ${cantidadCarrito} ${cantidadCarrito === 1 ? 'producto' : 'productos'}`}
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
          <span className="cart-badge">{cantidadCarrito}</span>
        </button>

        {carritoAbierto && (
          <CarritoPanel
            items={itemsCarrito}
            cantidad={cantidadCarrito}
            total={totalCarrito}
            onCambiarCantidad={onCambiarCantidad}
            onQuitar={onQuitarDelCarrito}
            onFinalizarCompra={onFinalizarCompra}
            onCerrar={() => setCarritoAbierto(false)}
          />
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
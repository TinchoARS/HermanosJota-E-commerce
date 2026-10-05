import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.svg';
import CarritoPanel from './CarritoPanel';

// Secciones a las que lleva el menú. El id es el del elemento destino.
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
  // Si el panel del carrito está desplegado. Es estado solo de la vista, así que
  // vive acá y no en App: los datos del carrito siguen llegando por props.
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const contenedorCarrito = useRef(null);
  const botonCarrito = useRef(null);

  // Si la página está scrolleada, la barra suma una sombra para separarse
  // del contenido que pasa por debajo.
  const [scrolleado, setScrolleado] = useState(false);

  useEffect(() => {
    const actualizar = () => setScrolleado(window.scrollY > 8);
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    return () => window.removeEventListener('scroll', actualizar);
  }, []);

  // La app no tiene router: el catálogo y el detalle son vistas de App.jsx.
  // Un href="#catalogo" pelado no funciona desde el detalle porque ese id no
  // está montado, así que se deja que App decida (volver al catálogo y
  // después scrollear). El href queda para abrir en otra pestaña o copiar.
  const handleClick = (e, seccion) => {
    e.preventDefault();
    onNavegar(seccion);
  };

  // Cierra el panel al hacer clic fuera de él o con Escape. El botón está
  // dentro del contenedor, así que el toggle no lo dispara este listener.
  // Se escucha pointerdown y no click: botones como "Quitar" desaparecen del
  // DOM al hacer clic, y para cuando llega el click ya no están dentro del
  // contenedor, así que el panel se cerraría solo.
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
        // El foco vuelve al botón que abrió el panel, para no perderse.
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

      {/* El carrito va en el medio del header: el grid de 3 columnas lo centra
          entre el logo (izquierda) y el menú (derecha). */}
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
          {/* Badge flotante con la cantidad de unidades */}
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
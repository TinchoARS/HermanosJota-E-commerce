import logo from '../assets/logo.svg';

// Secciones a las que lleva el menú. El id es el del elemento destino.
const SECCIONES = [
  { id: 'inicio', texto: 'INICIO' },
  { id: 'catalogo', texto: 'CATÁLOGO' },
  { id: 'contacto', texto: 'CONTACTO' },
];

const Navbar = ({ cantidadCarrito, onNavegar }) => {
  // La app no tiene router: el catálogo y el detalle son vistas de App.jsx.
  // Un href="#catalogo" pelado no funciona desde el detalle porque ese id no
  // está montado, así que se deja que App decida (volver al catálogo y
  // después scrollear). El href queda para abrir en otra pestaña o copiar.
  const handleClick = (e, seccion) => {
    e.preventDefault();
    onNavegar(seccion);
  };

  return (
    <nav id="inicio" className="navbar">
      <div className="navbar-logo-container">
        <img src={logo} alt="Logo Hermanos Jota" className="navbar-logo-img" />
        <span className="navbar-brand-text">HERMANOS JOTA</span>
      </div>

      <div className="navbar-menu">
        <ul className="navbar-links">
          {SECCIONES.map(({ id, texto }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => handleClick(e, id)}>{texto}</a>
            </li>
          ))}
        </ul>
        <button className="navbar-cart-btn">
          {/* Ícono de carrito blanco */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
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
          ({cantidadCarrito})
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
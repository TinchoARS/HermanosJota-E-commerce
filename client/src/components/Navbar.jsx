import logo from '../assets/logo.svg';

const Navbar = ({ cantidadCarrito }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        <img src={logo} alt="Logo Hermanos Jota" className="navbar-logo-img" />
        <span className="navbar-brand-text">HERMANOS JOTA</span>
      </div>

      <div className="navbar-menu">
        <ul className="navbar-links">
          <li><a href="#inicio">INICIO</a></li>
          <li><a href="#catalogo">CATÁLOGO</a></li>
          <li><a href="#contacto">CONTACTO</a></li>
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
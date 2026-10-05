// Íconos en SVG en vez de emojis: los emojis cambian de dibujo y de color
// según el sistema, y estos toman el color del texto (currentColor).
// Trazos de Feather Icons (licencia MIT), como el ícono del carrito.
const Icono = ({ children }) => (
  <svg
    className="footer-icono"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ICONOS = {
  ubicacion: (
    <Icono>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Icono>
  ),
  telefono: (
    <Icono>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Icono>
  ),
  email: (
    <Icono>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </Icono>
  ),
  instagram: (
    <Icono>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </Icono>
  ),
  web: (
    <Icono>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icono>
  ),
};

// Datos de contacto. Todos son links: la dirección abre el mapa, el WhatsApp
// abre el chat y el email abre el cliente de correo.
const CONTACTO = [
  {
    icono: 'ubicacion',
    texto: 'Av. San Juan 2847, CABA',
    href: 'https://www.google.com/maps/search/?api=1&query=Av.+San+Juan+2847,+CABA',
  },
  { icono: 'telefono', texto: 'WhatsApp: +54 11 4567-8900', href: 'https://wa.me/541145678900' },
  { icono: 'email', texto: 'info@hermanosjota.com.ar', href: 'mailto:info@hermanosjota.com.ar' },
];

const REDES = [
  { icono: 'instagram', texto: 'Instagram: @hermanosjota_ba', href: 'https://instagram.com/hermanosjota_ba' },
  { icono: 'web', texto: 'www.hermanosjota.com.ar', href: 'https://www.hermanosjota.com.ar' },
];

// mailto no abre una pestaña nueva; el resto son sitios externos.
const Enlace = ({ icono, texto, href }) => {
  const externo = href.startsWith('http');
  return (
    <li>
      <a
        className="footer-enlace"
        href={href}
        {...(externo && { target: '_blank', rel: 'noreferrer' })}
      >
        {ICONOS[icono]}
        <span>{texto}</span>
      </a>
    </li>
  );
};

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-title">Contacto</h4>
          <ul className="footer-lista">
            {CONTACTO.map((dato) => <Enlace key={dato.href} {...dato} />)}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Redes y Web</h4>
          <ul className="footer-lista">
            {REDES.map((dato) => <Enlace key={dato.href} {...dato} />)}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Hermanos Jota. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

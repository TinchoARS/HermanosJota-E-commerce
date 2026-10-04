import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-section">
          <h4 className="footer-title">Contacto</h4>
          <p>📍 Av. San Juan 2847, CABA</p>
          <p>📞 WhatsApp: +54 11 4567-8900</p>
          <p>✉️ ventas@hermanosjota.com.ar</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Redes y Web</h4>
          <p>📸 Instagram: <a href="https://instagram.com/hermanosjota_ba" target="_blank" rel="noreferrer">@hermanosjota_ba</a></p>
          <p>🌐 Web: <a href="https://www.hermanosjota.com.ar" target="_blank" rel="noreferrer">www.hermanosjota.com.ar</a></p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Hermanos Jota. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
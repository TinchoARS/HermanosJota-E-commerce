import React, { useState } from 'react';
import '../styles/style.css'; // Asegurate de que la ruta a tus estilos sea correcta

const ContactForm = () => {
  // Estado inicializado para controlar los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  // Manejador para actualizar el estado cada vez que el usuario escribe
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Validación simple: verificar que todos los campos tengan contenido
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.mensaje.trim()) {
      alert('Por favor, completá todos los campos antes de enviar.');
      return;
    }

    // Mensaje de éxito
    alert(`¡Gracias por tu mensaje, ${formData.nombre}! Nos pondremos en contacto a la brevedad.`);
    
    // Limpieza del formulario volviendo al estado inicial
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <section className="contact-section">
      <h2 className="contact-title">Contactanos</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            value={formData.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Enviar Mensaje</button>
      </form>
    </section>
  );
};

export default ContactForm;
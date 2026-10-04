import { useState } from 'react';

const VALORES_INICIALES = { nombre: '', email: '', mensaje: '' };

// Formato básico de email: algo@algo.algo, sin espacios.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devuelve un objeto { campo: mensaje } con los errores. Vacío = válido.
// Se usa trim() porque un campo con solo espacios pasa el `required` del HTML.
const validar = ({ nombre, email, mensaje }) => {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'Ingresá tu nombre.';
  if (!email.trim()) {
    errores.email = 'Ingresá tu correo electrónico.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errores.email = 'El correo electrónico no es válido.';
  }
  if (!mensaje.trim()) errores.mensaje = 'Escribí tu mensaje.';
  return errores;
};

const ContactForm = () => {
  // Estado controlado de los campos del formulario.
  const [formData, setFormData] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  // Nombre de quien envió, para el mensaje de éxito. null = no se envió.
  const [enviadoPor, setEnviadoPor] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((datos) => ({ ...datos, [name]: value }));
    // Al corregir un campo se borra su error, y si empieza a escribir de
    // nuevo el mensaje de éxito ya no corresponde.
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
    setEnviadoPor(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const nuevosErrores = validar(formData);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setEnviadoPor(null);
      return;
    }

    // No hay backend para el contacto: el envío se simula.
    console.log('Mensaje de contacto:', formData);
    setEnviadoPor(formData.nombre.trim());
    setFormData(VALORES_INICIALES);
  };

  // Props comunes de accesibilidad para cada campo según tenga error o no.
  const propsError = (campo) => ({
    'aria-invalid': Boolean(errores[campo]),
    'aria-describedby': errores[campo] ? `${campo}-error` : undefined,
  });

  const mensajeError = (campo) =>
    errores[campo] && (
      <span id={`${campo}-error`} className="form-error">{errores[campo]}</span>
    );

  return (
    <section id="contacto" className="contact-section">
      <h2 className="contact-title">Contactanos</h2>

      {/* noValidate: la validación la hace validar(), así los mensajes son
          los mismos en todos los navegadores. */}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            {...propsError('nombre')}
          />
          {mensajeError('nombre')}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            {...propsError('email')}
          />
          {mensajeError('email')}
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="5"
            value={formData.mensaje}
            onChange={handleChange}
            {...propsError('mensaje')}
          ></textarea>
          {mensajeError('mensaje')}
        </div>

        <button type="submit" className="submit-btn">Enviar Mensaje</button>

        {/* role="status" hace que los lectores de pantalla anuncien el
            mensaje sin mover el foco. */}
        <p className="contact-exito" role="status">
          {enviadoPor &&
            `¡Gracias por tu mensaje, ${enviadoPor}! Nos pondremos en contacto a la brevedad.`}
        </p>
      </form>
    </section>
  );
};

export default ContactForm;

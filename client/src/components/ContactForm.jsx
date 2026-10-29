import { useEffect, useRef, useState } from 'react';

const VALORES_INICIALES = { nombre: '', email: '', mensaje: '' };

const CAMPOS = Object.keys(VALORES_INICIALES);

const DURACION_EXITO_MS = 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [formData, setFormData] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviadoPor, setEnviadoPor] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!enviadoPor) return;
    const timer = setTimeout(() => setEnviadoPor(null), DURACION_EXITO_MS);
    return () => clearTimeout(timer);
  }, [enviadoPor]);

  useEffect(() => {
    const alCambiarDePestana = () => {
      if (document.hidden) setEnviadoPor(null);
    };
    document.addEventListener('visibilitychange', alCambiarDePestana);
    return () => document.removeEventListener('visibilitychange', alCambiarDePestana);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((datos) => ({ ...datos, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
    setEnviadoPor(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validar(formData);
    setErrores(nuevosErrores);
    const primerCampoConError = CAMPOS.find((campo) => nuevosErrores[campo]);
    if (primerCampoConError) {
      setEnviadoPor(null);
      formRef.current.elements[primerCampoConError].focus();
      return;
    }

    console.log('Mensaje de contacto:', formData);
    setEnviadoPor(formData.nombre.trim());
    setFormData(VALORES_INICIALES);
  };

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

      <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
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

        <p className="contact-exito" role="status">
          {enviadoPor &&
            `¡Gracias por tu mensaje, ${enviadoPor}! Nos pondremos en contacto a la brevedad.`}
        </p>
      </form>
    </section>
  );
};

export default ContactForm;

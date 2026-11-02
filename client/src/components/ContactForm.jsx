import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.svg';

const VALORES_INICIALES = { nombre: '', email: '', mensaje: '' };

const CAMPOS = Object.keys(VALORES_INICIALES);

const DURACION_EXITO_MS = 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Icono = ({ children }) => (
  <svg
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

const DATOS_CONTACTO = [
  {
    titulo: 'Showroom',
    texto: 'Av. San Juan 2847, CABA',
    href: 'https://www.google.com/maps/search/?api=1&query=Av.+San+Juan+2847,+CABA',
    icono: (
      <Icono>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </Icono>
    ),
  },
  {
    titulo: 'WhatsApp',
    texto: '+54 11 4567-8900',
    href: 'https://wa.me/541145678900',
    icono: (
      <Icono>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </Icono>
    ),
  },
  {
    titulo: 'Email',
    texto: 'info@hermanosjota.com.ar',
    href: 'mailto:info@hermanosjota.com.ar',
    icono: (
      <Icono>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </Icono>
    ),
  },
];

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

  const claseWrapper = (campo) =>
    `contact-input-wrapper${errores[campo] ? ' contact-input-wrapper--error' : ''}`;

  const mensajeError = (campo) =>
    errores[campo] && (
      <span id={`${campo}-error`} className="form-error">{errores[campo]}</span>
    );

  return (
    <section id="contacto" className="contact-section">
      <div className="contact-layout">
        <div className="contact-info">
          <p className="contact-eyebrow contact-anim contact-anim--1">Contacto</p>

          <h2 className="contact-title contact-anim contact-anim--2">
            Hablemos de tu <em>próximo mueble</em>
          </h2>

          <p className="contact-description contact-anim contact-anim--3">
            Contanos qué estás buscando y te respondemos a la brevedad. También
            podés visitarnos en el showroom o escribirnos por WhatsApp.
          </p>

          <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-field contact-anim contact-anim--4">
              <label htmlFor="nombre">Nombre completo</label>
              <div className={claseWrapper('nombre')}>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej. Ana Pérez"
                  autoComplete="name"
                  value={formData.nombre}
                  onChange={handleChange}
                  {...propsError('nombre')}
                />
              </div>
              {mensajeError('nombre')}
            </div>

            <div className="contact-field contact-anim contact-anim--5">
              <label htmlFor="email">Correo electrónico</label>
              <div className={claseWrapper('email')}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ej. ana@correo.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  {...propsError('email')}
                />
              </div>
              {mensajeError('email')}
            </div>

            <div className="contact-field contact-anim contact-anim--6">
              <label htmlFor="mensaje">Mensaje</label>
              <div className={claseWrapper('mensaje')}>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="5"
                  placeholder="Contanos qué necesitás: medidas, materiales, un mueble a medida…"
                  value={formData.mensaje}
                  onChange={handleChange}
                  {...propsError('mensaje')}
                ></textarea>
              </div>
              {mensajeError('mensaje')}
            </div>

            <button type="submit" className="contact-submit contact-anim contact-anim--7">
              Enviar mensaje
            </button>

            <p className="contact-success" role="status" aria-live="polite">
              {enviadoPor && (
                <>
                  <Icono>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </Icono>
                  <span>
                    ¡Gracias por tu mensaje, {enviadoPor}! Nos pondremos en contacto
                    a la brevedad.
                  </span>
                </>
              )}
            </p>
          </form>
        </div>

        <aside className="contact-visual" aria-label="Datos de contacto">
          <img
            className="contact-visual__imagen"
            src={logo}
            alt=""
            aria-hidden="true"
          />
          <span className="contact-visual__badge">Atención personalizada</span>

          <div className="contact-visual__tarjetas">
            {DATOS_CONTACTO.map(({ titulo, texto, href, icono }, indice) => {
              const externo = href.startsWith('http');
              return (
                <a
                  key={href}
                  className="contact-card"
                  href={href}
                  style={{ animationDelay: `${0.55 + indice * 0.15}s` }}
                  {...(externo && { target: '_blank', rel: 'noreferrer' })}
                >
                  <span className="contact-card__icono">{icono}</span>
                  <span>
                    <span className="contact-card__titulo">{titulo}</span>
                    <span className="contact-card__texto">{texto}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ContactForm;

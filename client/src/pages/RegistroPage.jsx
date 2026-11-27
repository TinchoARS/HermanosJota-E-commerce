import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegistroPage() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const { registro } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destino = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (detalles.length) setDetalles([]);
  };

  const validarCliente = () => {
    if (!form.nombre.trim()) {
      return 'El nombre es obligatorio.';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Ingresá un correo electrónico válido.';
    }
    if (form.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorValidacion = validarCliente();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setEnviando(true);
      setError('');
      setDetalles([]);

      await registro({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate(destino, { replace: true });
    } catch (err) {
      if (err.status === 409) {
        setError(err.message || 'Ya existe una cuenta registrada con ese email.');
      } else {
        setError(err.message || 'No se pudo completar el registro.');
        if (Array.isArray(err.detalles)) {
          setDetalles(err.detalles);
        }
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p>Registrate para gestionar tus pedidos en Hermanos Jota</p>

        {error && (
          <div className="error-mensaje" role="alert">
            <p>{error}</p>
            {detalles.length > 0 && (
              <ul>
                {detalles.map((detalle, idx) => (
                  <li key={idx}>{detalle}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="campo-grupo">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              autoComplete="name"
              disabled={enviando}
              required
            />
          </div>

          <div className="campo-grupo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              disabled={enviando}
              required
            />
          </div>

          <div className="campo-grupo">
            <label htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              autoComplete="new-password"
              disabled={enviando}
              required
            />
          </div>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-alternativa">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" state={location.state}>
            Iniciá sesión acá
          </Link>
        </p>
      </div>
    </section>
  );
}
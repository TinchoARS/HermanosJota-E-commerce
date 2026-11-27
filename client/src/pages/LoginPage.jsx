import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ruta de origen guardada por <ProtectedRoute> o por el flujo de compra
  const destino = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Completá tu email y contraseña.');
      return;
    }

    try {
      setEnviando(true);
      setError('');
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(destino, { replace: true });
    } catch (err) {
      if (err.status === 401) {
        setError(err.message || 'Email o contraseña incorrectos.');
      } else {
        setError(err.message || 'No se pudo iniciar sesión. Intentá nuevamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <p>Ingresá a tu cuenta de Mueblería Hermanos Jota</p>

        {error && (
          <div className="error-mensaje" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              autoComplete="current-password"
              disabled={enviando}
              required
            />
          </div>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Propagamos location.state para no perder la ruta de retorno si el usuario decide registrarse */}
        <p className="auth-alternativa">
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/registro" state={location.state}>
            Registrate acá
          </Link>
        </p>
      </div>
    </section>
  );
}
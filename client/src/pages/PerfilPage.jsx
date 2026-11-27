import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { perfilRequest } from '../services/api';

const formatearFecha = (fechaIso) => {
  if (!fechaIso) return null;
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function PerfilPage() {
  const { usuario, logout } = useAuth();
  const [datosPerfil, setDatosPerfil] = useState(usuario);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      try {
        setCargando(true);
        setError('');
        const respuesta = await perfilRequest();
        // Soporta tanto { usuario: {...} } como el objeto usuario directo
        if (activo) {
          setDatosPerfil(respuesta?.usuario ?? respuesta);
        }
      } catch (err) {
        if (activo) {
          if (err.status === 401) {
            logout();
            navigate('/login', { replace: true });
            return;
          }
          setError(err.message || 'No se pudieron actualizar los datos del perfil.');
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPerfil();
    return () => {
      activo = false;
    };
  }, [logout, navigate]);

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const fechaAlta = formatearFecha(datosPerfil?.createdAt);

  return (
    <section className="perfil-page">
      <div className="perfil-card">
        <h1>Mi perfil</h1>
        <p className="perfil-subtitulo">Información de tu cuenta en Hermanos Jota</p>

        {error && (
          <div className="error-mensaje" role="alert">
            {error}
          </div>
        )}

        {cargando && !datosPerfil ? (
          <p role="status">Cargando datos de tu cuenta...</p>
        ) : (
          <dl className="perfil-datos">
            <div className="perfil-dato-fila">
              <dt>Nombre</dt>
              <dd>{datosPerfil?.nombre || '—'}</dd>
            </div>

            <div className="perfil-dato-fila">
              <dt>Correo electrónico</dt>
              <dd>{datosPerfil?.email || '—'}</dd>
            </div>

            {fechaAlta && (
              <div className="perfil-dato-fila">
                <dt>Miembro desde</dt>
                <dd>{fechaAlta}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="perfil-acciones">
          <Link to="/mis-pedidos" className="perfil-link-pedidos">
            Ver mis pedidos
          </Link>

          <button
            type="button"
            onClick={handleCerrarSesion}
            className="submit-btn perfil-btn-salir"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}
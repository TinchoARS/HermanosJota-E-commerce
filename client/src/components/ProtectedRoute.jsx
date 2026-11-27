import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { usuario, cargando } = useAuth();
  const location = useLocation();
  const outletContext = useOutletContext();

  // Evita redirigir al login mientras se verifica el token guardado en localStorage
  if (cargando) {
    return (
      <div className="cargando-sesion" role="status">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet context={outletContext} />;
}
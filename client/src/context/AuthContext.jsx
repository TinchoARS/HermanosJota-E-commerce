import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registroRequest, perfilRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  // Arranca en true si hay token para evitar que ProtectedRoute expulse al usuario antes de validar
  const [cargando, setCargando] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const validarSesion = async () => {
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const data = await perfilRequest();
        setUsuario(data.usuario);
      } catch {
        // Si el backend responde 401 (token vencido o inválido), limpiamos la sesión
        cerrarSesion();
      } finally {
        setCargando(false);
      }
    };

    validarSesion();
  }, [token]);

  const guardarSesion = (nuevoToken, datosUsuario) => {
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const login = async (credenciales) => {
    const data = await loginRequest(credenciales);
    guardarSesion(data.token, data.usuario);
    return data;
  };

  const registro = async (datosRegistro) => {
    const data = await registroRequest(datosRegistro);
    guardarSesion(data.token, data.usuario);
    return data;
  };

  const value = {
    usuario,
    token,
    cargando,
    login,
    registro,
    logout: cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
}
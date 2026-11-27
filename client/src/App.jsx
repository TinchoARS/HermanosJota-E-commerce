import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import InicioPage from './pages/InicioPage';
import CatalogoPage from './pages/CatalogoPage';
import DetallePage from './pages/DetallePage';
import ContactoPage from './pages/ContactoPage';
import CrearProductoPage from './pages/CrearProductoPage';
import EditarProductoPage from './pages/EditarProductoPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import PerfilPage from './pages/PerfilPage';
import MisPedidosPage from './pages/MisPedidosPage';
import NoEncontradoPage from './pages/NoEncontradoPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<InicioPage />} />
        <Route path="/productos" element={<CatalogoPage />} />
        <Route path="/productos/:id" element={<DetallePage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />

        {/* Rutas protegidas (F5) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
          <Route path="/admin/crear-producto" element={<CrearProductoPage />} />
          <Route path="/admin/editar-producto/:id" element={<EditarProductoPage />} />
        </Route>

        <Route path="*" element={<NoEncontradoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
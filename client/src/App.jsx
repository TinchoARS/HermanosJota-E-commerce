import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InicioPage from './pages/InicioPage';
import CatalogoPage from './pages/CatalogoPage';
import DetallePage from './pages/DetallePage';
import ContactoPage from './pages/ContactoPage';
import CrearProductoPage from './pages/CrearProductoPage';
import EditarProductoPage from './pages/EditarProductoPage';
import NoEncontradoPage from './pages/NoEncontradoPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<InicioPage />} />
        <Route path="/productos" element={<CatalogoPage />} />
        <Route path="/productos/:id" element={<DetallePage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/admin/crear-producto" element={<CrearProductoPage />} />
        <Route path="/admin/editar-producto/:id" element={<EditarProductoPage />} />
        <Route path="*" element={<NoEncontradoPage />} />
      </Route>
    </Routes>
  );
}

export default App;

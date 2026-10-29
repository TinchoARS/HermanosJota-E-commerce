import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { crearProducto } from '../services/api';
import '../styles/admin.css';

const MENSAJE_ERROR = 'No pudimos guardar el producto. Intentá de nuevo.';

const CrearProductoPage = () => {
  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (datos) => {
    setEnviando(true);
    setErrorServidor(null);
    try {
      await crearProducto(datos);
      navigate('/productos');
    } catch {
      setErrorServidor(MENSAJE_ERROR);
      setEnviando(false);
    }
  };

  return (
    <section className="admin-section">
      <h1 className="admin-titulo">Nuevo producto</h1>

      <ProductForm
        onSubmit={handleSubmit}
        textoBoton="Crear producto"
        enviando={enviando}
        errorServidor={errorServidor}
      >
        <Link to="/productos" className="admin-link-cancelar">Cancelar</Link>
      </ProductForm>
    </section>
  );
};

export default CrearProductoPage;

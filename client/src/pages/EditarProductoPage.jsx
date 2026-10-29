import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import useProducto from '../hooks/useProducto';
import { actualizarProducto } from '../services/api';
import '../styles/catalogo.css';
import '../styles/producto-detalle.css';
import '../styles/admin.css';

const MENSAJE_ERROR = 'No pudimos guardar los cambios. Intentá de nuevo.';

const aValoresIniciales = (producto) => ({
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: producto.precio,
  stock: producto.stock ?? 0,
  imagenUrl: producto.imagenUrl,
});

const EditarProductoPage = () => {
  const { id } = useParams();
  const { producto, loading, error, noEncontrado, idInvalido, recargar } = useProducto(id);
  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (datos) => {
    setEnviando(true);
    setErrorServidor(null);
    try {
      await actualizarProducto(id, datos);
      navigate(`/productos/${id}`);
    } catch {
      setErrorServidor(MENSAJE_ERROR);
      setEnviando(false);
    }
  };

  const linkCatalogo = (
    <Link to="/productos" className="btn btn-secundario">
      Volver al catálogo
    </Link>
  );

  if (idInvalido) {
    return (
      <section className="catalogo-estado" role="alert">
        <h2 className="catalogo-titulo">Producto no válido</h2>
        <p>La dirección que abriste no corresponde a ningún producto. Revisala o volvé al catálogo.</p>
        {linkCatalogo}
      </section>
    );
  }

  if (noEncontrado) {
    return (
      <section className="catalogo-estado" role="alert">
        <h2 className="catalogo-titulo">Producto no encontrado</h2>
        <p>El producto que querés editar no existe o ya no está disponible.</p>
        {linkCatalogo}
      </section>
    );
  }

  if (error) {
    return (
      <section className="catalogo-estado" role="alert">
        <p>{error}</p>
        <div className="producto-detalle__acciones">
          <button type="button" className="btn btn-primario" onClick={recargar}>
            Reintentar
          </button>
          {linkCatalogo}
        </div>
      </section>
    );
  }

  if (loading || !producto) {
    return (
      <section className="catalogo-estado" role="status">
        <span className="spinner" aria-hidden="true"></span>
        <p>Cargando producto…</p>
        {linkCatalogo}
      </section>
    );
  }

  return (
    <section className="admin-section">
      <h1 className="admin-titulo">Editar producto</h1>

      <ProductForm
        key={producto._id}
        valoresIniciales={aValoresIniciales(producto)}
        onSubmit={handleSubmit}
        textoBoton="Guardar cambios"
        enviando={enviando}
        errorServidor={errorServidor}
      >
        <Link to={`/productos/${id}`} className="admin-link-cancelar">Cancelar</Link>
      </ProductForm>
    </section>
  );
};

export default EditarProductoPage;

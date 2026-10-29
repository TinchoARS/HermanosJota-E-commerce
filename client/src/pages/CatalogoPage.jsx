import { useOutletContext } from 'react-router-dom';
import ProductList from '../components/ProductList';

const CatalogoPage = () => {
  const { productos, loading, error, recargar, agregarAlCarrito, filtros, setFiltros } =
    useOutletContext();

  return (
    <ProductList
      productos={productos}
      loading={loading}
      error={error}
      onReintentar={recargar}
      onAgregar={agregarAlCarrito}
      filtros={filtros}
      onCambiarFiltros={setFiltros}
    />
  );
};

export default CatalogoPage;

import { useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';

const InicioPage = () => {
  const { productos, loading, error, recargar, agregarAlCarrito, cantidadEnCarrito, filtros, setFiltros } =
    useOutletContext();

  return (
    <>
      <Hero />
      <ProductList
        productos={productos}
        loading={loading}
        error={error}
        onReintentar={recargar}
        onAgregar={agregarAlCarrito}
        cantidadEnCarrito={cantidadEnCarrito}
        filtros={filtros}
        onCambiarFiltros={setFiltros}
      />
    </>
  );
};

export default InicioPage;

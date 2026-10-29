import { useParams, useOutletContext } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';

const DetallePage = () => {
  const { id } = useParams();
  const { productos, agregarAlCarrito } = useOutletContext();

  const productoInicial = productos.find((p) => p._id === id);

  return (
    <ProductDetail
      key={id}
      id={id}
      productoInicial={productoInicial}
      onAgregar={agregarAlCarrito}
    />
  );
};

export default DetallePage;

import { useParams, useOutletContext } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { eliminarProducto } from '../services/api';

const DetallePage = () => {
  const { id } = useParams();
  const { productos, agregarAlCarrito, cantidadEnCarrito, quitarDelCarrito, recargar } = useOutletContext();

  const productoInicial = productos.find((p) => p._id === id);

  const handleEliminar = async () => {
    await eliminarProducto(id);
    quitarDelCarrito(id);
    recargar();
  };

  return (
    <ProductDetail
      key={id}
      id={id}
      productoInicial={productoInicial}
      enCarrito={cantidadEnCarrito(id)}
      onAgregar={agregarAlCarrito}
      onEliminar={handleEliminar}
    />
  );
};

export default DetallePage;

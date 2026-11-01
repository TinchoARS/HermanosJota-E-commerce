import { useParams, useOutletContext } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { eliminarProducto } from '../services/api';

const DetallePage = () => {
  const { id } = useParams();
  
  // Extraemos también quitarDelCarrito y recargar del estado global
  const { productos, agregarAlCarrito, quitarDelCarrito, recargar } = useOutletContext();

  const productoInicial = productos.find((p) => p._id === id);

  const handleEliminar = async (idProducto) => {
    // 1. Borramos el producto en la base de datos
    await eliminarProducto(idProducto);
    
    // 2. Lo sacamos del carrito usando la función global (sin crear instancias nuevas)
    quitarDelCarrito(idProducto);
    
    // 3. Forzamos la actualización del catálogo para que ya no aparezca
    recargar();
  };

  return (
    <ProductDetail
      key={id}
      id={id}
      productoInicial={productoInicial}
      onAgregar={agregarAlCarrito}
      onEliminar={handleEliminar}
    />
  );
};

export default DetallePage;
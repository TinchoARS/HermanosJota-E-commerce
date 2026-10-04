import { useEffect, useState } from 'react';

// Estado del carrito y del aviso "se agregó al carrito".
// Se llama desde App.jsx, así que el estado vive en App (un hook guarda su
// estado en el componente que lo usa): el contador baja a Navbar por props.
const useCarrito = () => {
  // Se guardan los ids agregados. Con guardar el id alcanza para contar y
  // evita duplicar en memoria los objetos completos.
  const [carrito, setCarrito] = useState([]);

  // Aviso flotante del último producto agregado. null = no se muestra.
  const [aviso, setAviso] = useState(null);

  // onAgregar baja desde ProductList y desde ProductDetail hasta acá.
  // Se usa la forma funcional de setState porque así React usa el valor
  // más reciente del carrito y no el del render en que se creó la función.
  const agregarAlCarrito = (producto) => {
    setCarrito((items) => [...items, producto.id]);
    // Date.now() como id: cada agregado es un aviso nuevo, aunque sea el
    // mismo producto, así se reinicia el temporizador y la animación.
    setAviso({ id: Date.now(), nombre: producto.nombre });
  };

  // El aviso se oculta solo a los 2,5 s. Si se agrega otro antes, el cleanup
  // cancela el temporizador anterior y arranca uno nuevo.
  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 2500);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  return { cantidad: carrito.length, aviso, agregarAlCarrito };
};

export default useCarrito;

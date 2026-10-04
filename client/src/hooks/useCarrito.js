import { useEffect, useMemo, useState } from 'react';

// Clave con la que se guarda el carrito en el navegador.
const CLAVE_CARRITO = 'hermanosjota-carrito';

// Lee el carrito guardado. Se valida cada entrada y se descarta la que no tenga
// la forma { [id]: cantidad } con cantidad entera positiva, así un
// localStorage editado a mano (o de una versión vieja de la app) no rompe nada.
const leerCarrito = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (!guardado || typeof guardado !== 'object' || Array.isArray(guardado)) return {};

    const carrito = {};
    Object.entries(guardado).forEach(([id, cantidad]) => {
      const idNumero = Number(id);
      if (Number.isInteger(idNumero) && Number.isInteger(cantidad) && cantidad > 0) {
        carrito[idNumero] = cantidad;
      }
    });
    return carrito;
  } catch {
    // JSON inválido o localStorage bloqueado: se arranca con el carrito vacío.
    return {};
  }
};

const guardarCarrito = (carrito) => {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch {
    // Si el navegador no deja escribir (modo privado, cuota llena), el carrito
    // sigue funcionando en memoria, solo se pierde al recargar.
  }
};

// Estado del carrito y del aviso "se agregó al carrito".
// Se llama desde App.jsx, así que el estado vive en App (un hook guarda su
// estado en el componente que lo usa): el contador, el listado y el total bajan
// a Navbar por props.
// Recibe el catálogo porque hace falta para resolver los ids guardados.
const useCarrito = (productos = []) => {
  // El carrito son cantidades por id de producto: { 3: 2 } son dos unidades
  // del producto 3. Así agregar dos veces el mismo producto agranda la cantidad
  // en vez de duplicar la fila.
  const [carrito, setCarrito] = useState(leerCarrito);

  // Aviso flotante del último producto agregado. null = no se muestra.
  const [aviso, setAviso] = useState(null);

  // Se persiste cada cambio para que el carrito sobreviva a la recarga.
  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  // onAgregar baja desde ProductList y desde ProductDetail hasta acá.
  // Se usa la forma funcional de setState porque así React usa el valor
  // más reciente del carrito y no el del render en que se creó la función.
  const agregarAlCarrito = (producto) => {
    setCarrito((items) => ({ ...items, [producto.id]: (items[producto.id] || 0) + 1 }));
    // Date.now() como id: cada agregado es un aviso nuevo, aunque sea el
    // mismo producto, así se reinicia el temporizador y la animación.
    setAviso({ id: Date.now(), nombre: producto.nombre });
  };

  // Para mostrarlo se cruzan las cantidades guardadas con el catálogo. Si un id
  // guardado ya no corresponde a ningún producto se ignora en lugar de romper
  // el render.
  const items = useMemo(
    () =>
      Object.entries(carrito)
        .map(([id, cantidad]) => {
          const producto = productos.find((item) => item.id === Number(id));
          return producto ? { ...producto, cantidad } : null;
        })
        .filter(Boolean),
    [carrito, productos]
  );

  // El total sale de lo que se puede mostrar: un producto que ya no existe no
  // tiene precio que sumar.
  const total = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [items]
  );

  // Cantidad total de unidades, para el badge. Sale del carrito guardado y no
  // de items, así el número aparece apenas carga la app y no recién cuando
  // llega el catálogo.
  const cantidad = Object.values(carrito).reduce((suma, n) => suma + n, 0);

  // El aviso se oculta solo a los 2,5 s. Si se agrega otro antes, el cleanup
  // cancela el temporizador anterior y arranca uno nuevo.
  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 2500);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  return { items, cantidad, total, aviso, agregarAlCarrito };
};

export default useCarrito;

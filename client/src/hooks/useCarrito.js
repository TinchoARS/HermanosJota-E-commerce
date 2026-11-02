import { useEffect, useMemo, useState } from 'react';

const CLAVE_CARRITO = 'hermanosjota-carrito';

const leerCarrito = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (!guardado || typeof guardado !== 'object' || Array.isArray(guardado)) return {};

    const carrito = {};
    Object.entries(guardado).forEach(([id, cantidad]) => {
      if (id && Number.isInteger(cantidad) && cantidad > 0) {
        carrito[id] = cantidad;
      }
    });
    return carrito;
  } catch {
    return {};
  }
};

const guardarCarrito = (carrito) => {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch {
  }
};

const sinProducto = (carrito, id) => {
  const copia = { ...carrito };
  delete copia[id];
  return copia;
};

const useCarrito = (productos = []) => {
  const [carrito, setCarrito] = useState(leerCarrito);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  const cantidadEnCarrito = (id) => carrito[id] || 0;

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const disponible = (producto.stock ?? 0) - cantidadEnCarrito(producto._id);
    const cantidadAgregada = Math.min(cantidad, disponible);
    if (cantidadAgregada <= 0) return;

    setCarrito((items) => ({
      ...items,
      [producto._id]: (items[producto._id] || 0) + cantidadAgregada,
    }));
    setAviso({ id: Date.now(), nombre: producto.nombre, cantidad: cantidadAgregada });
  };

  const cambiarCantidad = (id, diferencia) => {
    const stock = productos.find((p) => p._id === id)?.stock ?? Infinity;

    setCarrito((items) => {
      const nuevaCantidad = Math.min((items[id] || 0) + diferencia, stock);
      return nuevaCantidad > 0 ? { ...items, [id]: nuevaCantidad } : sinProducto(items, id);
    });
  };

  const quitarDelCarrito = (id) => setCarrito((items) => sinProducto(items, id));

  const vaciarCarrito = () => setCarrito({});

  const items = useMemo(
    () =>
      Object.entries(carrito)
        .map(([id, cantidad]) => {
          const producto = productos.find((item) => item._id === id);
          return producto ? { ...producto, cantidad } : null;
        })
        .filter(Boolean),
    [carrito, productos]
  );

  const total = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [items]
  );

  const cantidad =
    productos.length > 0
      ? items.reduce((suma, item) => suma + item.cantidad, 0)
      : Object.values(carrito).reduce((suma, n) => suma + n, 0);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), 2500);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  return {
    items,
    cantidad,
    total,
    aviso,
    cantidadEnCarrito,
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
  };
};

export default useCarrito;
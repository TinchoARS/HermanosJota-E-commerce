import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const datosInvalidos = (res, detalles) => res.status(400).json({ error: 'Datos inválidos', detalles });

// Valida el body y junta las cantidades si el mismo producto viene repetido.
const leerItems = (body) => {
  const items = body?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return { detalles: { items: 'El pedido tiene que tener al menos un producto' } };
  }

  const detalles = {};
  const cantidades = new Map();

  items.forEach((item, i) => {
    const producto = item?.producto;
    const cantidad = item?.cantidad;

    if (!mongoose.isValidObjectId(producto)) {
      detalles[`items.${i}.producto`] = 'El producto no es válido';
    }
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      detalles[`items.${i}.cantidad`] = 'La cantidad tiene que ser un número entero mayor o igual a 1';
    }
    if (detalles[`items.${i}.producto`] || detalles[`items.${i}.cantidad`]) return;

    const id = String(producto);
    cantidades.set(id, (cantidades.get(id) ?? 0) + cantidad);
  });

  if (Object.keys(detalles).length > 0) return { detalles };

  return { pedidos: [...cantidades].map(([producto, cantidad]) => ({ producto, cantidad })) };
};

const devolverStock = (descontados) =>
  Promise.all(
    descontados.map(({ producto, cantidad }) => Product.updateOne({ _id: producto }, { $inc: { stock: cantidad } }))
  );

export async function crearPedido(req, res) {
  const { detalles, pedidos } = leerItems(req.body);
  if (detalles) return datosInvalidos(res, detalles);

  const productos = await Product.find({ _id: { $in: pedidos.map((p) => p.producto) } });
  const porId = new Map(productos.map((p) => [String(p._id), p]));

  const faltantes = pedidos.filter((p) => !porId.has(p.producto));
  if (faltantes.length > 0) {
    return datosInvalidos(
      res,
      Object.fromEntries(faltantes.map((p) => [`producto.${p.producto}`, 'El producto no existe']))
    );
  }

  // Descuenta el stock solo si alcanza. Si un producto no tiene stock, devuelve lo que ya se descontó.
  const descontados = [];
  for (const { producto, cantidad } of pedidos) {
    const actualizado = await Product.findOneAndUpdate(
      { _id: producto, stock: { $gte: cantidad } },
      { $inc: { stock: -cantidad } }
    );

    if (!actualizado) {
      await devolverStock(descontados);
      const { nombre, stock } = (await Product.findById(producto)) ?? porId.get(producto);
      return res.status(400).json({
        error: 'No hay stock suficiente',
        detalles: { [`producto.${producto}`]: `Quedan ${stock} ${stock === 1 ? 'unidad' : 'unidades'} de ${nombre}` },
      });
    }

    descontados.push({ producto, cantidad });
  }

  // Los precios salen de la base, nunca del front.
  const items = pedidos.map(({ producto, cantidad }) => {
    const { nombre, precio } = porId.get(producto);
    return { producto, nombre, precio, cantidad };
  });
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  try {
    const pedido = await Order.create({ usuario: req.usuario.id, items, total });
    res.status(201).json({ pedido });
  } catch (error) {
    await devolverStock(descontados);
    throw error;
  }
}

export async function getMisPedidos(req, res) {
  const pedidos = await Order.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });
  res.json(pedidos);
}

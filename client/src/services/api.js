import { API_URL } from '../config/api';

const URL_PRODUCTOS = `${API_URL}/api/productos`;

const errorHttp = (res) => {
  const error = new Error(`El servidor respondió ${res.status}`);
  error.status = res.status;
  return error;
};

const aProducto = ({ id, imagen, ...producto }) => ({
  ...producto,
  _id: producto._id ?? String(id),
  imagenUrl: producto.imagenUrl ?? imagen ?? '',
});

export const listarProductos = async (signal) => {
  const res = await fetch(URL_PRODUCTOS, { signal });
  if (!res.ok) throw errorHttp(res);
  const productos = await res.json();
  return productos.map(aProducto);
};

export const obtenerProducto = async (id, signal) => {
  const res = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`, { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw errorHttp(res);
  return aProducto(await res.json());
};

const PAUSA_SIMULADA_MS = 600;

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO(B2): simulado. Falta probar el alta (F4) contra el POST real.
export const crearProducto = async (datos) => {
  await esperar(PAUSA_SIMULADA_MS);
  return { _id: `simulado-${Date.now()}`, ...datos, createdAt: new Date().toISOString() };
};

// TODO(B3): simulado. Falta probar la edición (F5) contra el PUT real.
export const actualizarProducto = async (id, datos) => {
  await esperar(PAUSA_SIMULADA_MS);
  return { _id: id, ...datos, updatedAt: new Date().toISOString() };
};

export const urlImagen = (imagenUrl) => {
  if (!imagenUrl) return undefined;
  if (/^https?:\/\//i.test(imagenUrl)) return imagenUrl;
  return `${API_URL}/${encodeURI(imagenUrl.replace(/^\/+/, ''))}`;
};

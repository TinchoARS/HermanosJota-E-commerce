import { API_URL } from '../config/api';

const URL_PRODUCTOS = `${API_URL}/api/productos`;

const urlProducto = (id) => `${URL_PRODUCTOS}/${encodeURIComponent(id)}`;

const errorHttp = async (res) => {
  const cuerpo = await res.json().catch(() => ({}));
  const error = new Error(cuerpo.error ?? `El servidor respondió ${res.status}`);
  error.status = res.status;
  error.detalles = cuerpo.detalles;
  return error;
};

const aProducto = ({ id, imagen, ...producto }) => ({
  ...producto,
  _id: producto._id ?? String(id),
  imagenUrl: producto.imagenUrl ?? imagen ?? '',
});

const enviarProducto = async (url, method, datos) => {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw await errorHttp(res);
  return aProducto(await res.json());
};

export const listarProductos = async (signal) => {
  const res = await fetch(URL_PRODUCTOS, { signal });
  if (!res.ok) throw await errorHttp(res);
  const productos = await res.json();
  return productos.map(aProducto);
};

export const obtenerProducto = async (id, signal) => {
  const res = await fetch(urlProducto(id), { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw await errorHttp(res);
  return aProducto(await res.json());
};

export const crearProducto = (datos) => enviarProducto(URL_PRODUCTOS, 'POST', datos);

export const actualizarProducto = (id, datos) => enviarProducto(urlProducto(id), 'PUT', datos);

export const eliminarProducto = async (id) => {
  const res = await fetch(urlProducto(id), { method: 'DELETE' });
  if (!res.ok) throw await errorHttp(res);
};

export const urlImagen = (imagenUrl) => {
  if (!imagenUrl) return undefined;
  if (/^https?:\/\//i.test(imagenUrl)) return imagenUrl;
  return `${API_URL}/${encodeURI(imagenUrl.replace(/^\/+/, ''))}`;
};

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

export const crearProducto = async (datos) => {
  const res = await fetch(URL_PRODUCTOS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });
  
  if (!res.ok) {
    // Intentamos extraer el texto de validación (400) que manda el backend para mostrarlo en el formulario
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.mensaje || errorData.message || errorData.error || `Error ${res.status}`);
    error.status = res.status;
    throw error;
  }
  
  return aProducto(await res.json());
};

export const actualizarProducto = async (id, datos) => {
  const res = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.mensaje || errorData.message || errorData.error || `Error ${res.status}`);
    error.status = res.status;
    throw error;
  }
  
  return aProducto(await res.json());
};

export const urlImagen = (imagenUrl) => {
  if (!imagenUrl) return undefined;
  if (/^https?:\/\//i.test(imagenUrl)) return imagenUrl;
  return `${API_URL}/${encodeURI(imagenUrl.replace(/^\/+/, ''))}`;
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${URL_PRODUCTOS}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) throw errorHttp(res);
  
  return { success: true };
};
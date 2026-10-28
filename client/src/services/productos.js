import { API_URL } from '../config/api';

export const obtenerProductos = async (signal) => {
  const res = await fetch(`${API_URL}/api/productos`, { signal });

  if (!res.ok) {
    throw new Error(`El servidor respondió ${res.status}`);
  }

  return res.json();
};

export const obtenerProducto = async (id, signal) => {
  const res = await fetch(`${API_URL}/api/productos/${id}`, { signal });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`El servidor respondió ${res.status}`);
  }

  return res.json();
};

export const urlImagen = (imagen) => `${API_URL}/${encodeURI(imagen)}`;

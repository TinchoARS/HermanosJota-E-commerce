const NOMBRES_CAMPOS = {
  nombre: 'el nombre',
  descripcion: 'la descripción',
  precio: 'el precio',
  stock: 'el stock',
  imagenUrl: 'la imagen',
};

const listaCampos = new Intl.ListFormat('es', { type: 'conjunction' });

const mensajeError = (error, mensajePorDefecto) => {
  if (error.status === 404) return 'El producto ya no existe o fue eliminado.';
  if (error.status !== 400) return mensajePorDefecto;

  const campos = Object.keys(error.detalles ?? {}).map((campo) => NOMBRES_CAMPOS[campo] ?? campo);
  if (campos.length === 0) return 'Revisá los datos e intentá de nuevo.';
  return `Revisá ${listaCampos.format(campos)} e intentá de nuevo.`;
};

export default mensajeError;

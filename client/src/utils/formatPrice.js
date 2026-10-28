const formatPrice = (precio) =>
  precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export default formatPrice;

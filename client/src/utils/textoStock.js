const textoStock = (stock, enCarrito = 0) => {
  if (stock === 0) return 'Sin stock';
  if (enCarrito >= stock) return 'Ya tenés todo el stock en el carrito';
  return `Stock disponible: ${stock}`;
};

export default textoStock;

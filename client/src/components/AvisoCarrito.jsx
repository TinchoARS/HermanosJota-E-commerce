// Aviso flotante de "se agregó al carrito". Es position: fixed, así se ve
// sin importar dónde esté scrolleada la página.
// role="status" hace que los lectores de pantalla lo anuncien.
const AvisoCarrito = ({ aviso }) => {
  return (
    <div className="aviso-carrito" role="status">
      {aviso && (
        // key distinta en cada agregado: React vuelve a montar el <p> y la
        // animación de entrada se repite aunque el aviso ya estuviera visible.
        <p key={aviso.id} className="aviso-carrito__texto">
          ✓ <strong>{aviso.nombre}</strong> se agregó al carrito
        </p>
      )}
    </div>
  );
};

export default AvisoCarrito;

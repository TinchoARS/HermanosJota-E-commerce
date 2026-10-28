const AvisoCarrito = ({ aviso }) => {
  return (
    <div className="aviso-carrito" role="status">
      {aviso && (
        <p key={aviso.id} className="aviso-carrito__texto">
          {aviso.cantidad > 1 ? (
            <>✓ <strong>{aviso.cantidad} × {aviso.nombre}</strong> se agregaron al carrito</>
          ) : (
            <>✓ <strong>{aviso.nombre}</strong> se agregó al carrito</>
          )}
        </p>
      )}
    </div>
  );
};

export default AvisoCarrito;

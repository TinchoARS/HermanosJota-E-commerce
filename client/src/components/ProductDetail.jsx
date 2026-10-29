import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import useProducto from '../hooks/useProducto';

import useCarrito from '../hooks/useCarrito'; // Asegurate de que la ruta a tu hook sea correcta

import { urlImagen, eliminarProducto } from '../services/api';

import formatPrice from '../utils/formatPrice';

import '../styles/catalogo.css';

import '../styles/producto-detalle.css';



const CANTIDAD_MAXIMA = 10;



const ProductDetail = ({ id, productoInicial, onAgregar }) => {

  const { producto: detalle, error, noEncontrado, idInvalido, recargar } = useProducto(id);

  const navigate = useNavigate();

  const { quitarDelCarrito } = useCarrito();



  const datos = detalle ?? productoInicial;



  const [cantidad, setCantidad] = useState(1);

  const [eliminando, setEliminando] = useState(false);



  const botonVolver = (

    <Link to="/productos" className="btn btn-secundario">

      Volver al catálogo

    </Link>

  );



  if (idInvalido) {

    return (

      <section className="catalogo-estado" role="alert">

        <h2 className="catalogo-titulo">Producto no válido</h2>

        <p>La dirección que abriste no corresponde a ningún producto. Revisala o volvé al catálogo.</p>

        {botonVolver}

      </section>

    );

  }



  if (noEncontrado) {

    return (

      <section className="catalogo-estado" role="alert">

        <h2 className="catalogo-titulo">Producto no encontrado</h2>

        <p>El producto que buscás no existe o ya no está disponible.</p>

        {botonVolver}

      </section>

    );

  }



  if (error && !datos) {

    return (

      <section className="catalogo-estado" role="alert">

        <p>{error}</p>

        <div className="producto-detalle__acciones">

          <button type="button" className="btn btn-primario" onClick={recargar}>

            Reintentar

          </button>

          {botonVolver}

        </div>

      </section>

    );

  }



  if (!datos) {

    return (

      <section className="catalogo-estado" role="status">

        <span className="spinner" aria-hidden="true"></span>

        <p>Cargando producto…</p>

        {botonVolver}

      </section>

    );

  }



  const { nombre, descripcion, precio, imagenUrl, stock = 0, _id } = datos;

  const sinStock = stock === 0;

  const cantidadMaxima = sinStock ? 1 : Math.min(CANTIDAD_MAXIMA, stock);

 

  // Usamos el _id de los datos o el id que viene por prop si no está

  const idProducto = _id || id;



  const agregar = () => {

    if (sinStock) return;

    onAgregar(datos, cantidad);

    setCantidad(1);

  };



  const handleEliminar = async () => {
    const confirmado = window.confirm('¿Estás seguro de que querés eliminar este producto?');
    if (!confirmado) return;

    setEliminando(true);
    try {
      await eliminarProducto(idProducto);
      quitarDelCarrito(idProducto);
      
      // Le damos 150ms a React para que su useEffect llegue a guardar en el localStorage, y asi verificar eliminacion de producto.  
      setTimeout(() => {
        window.location.href = '/productos';
      }, 150);
      
    } catch (err) {
      console.error('Error simulado al eliminar:', err);
      alert('Hubo un problema al intentar eliminar el producto.');
      setEliminando(false); 
    }
  };



  return (

    <section className="producto-detalle">

      <nav className="producto-detalle__miga" aria-label="Ubicación">

        <ol>

          <li>

            <Link to="/productos" className="producto-detalle__miga-link">

              Catálogo

            </Link>

          </li>

          <li aria-current="page">{nombre}</li>

        </ol>

      </nav>



      <div className="producto-detalle__imagen">

        <img

          src={urlImagen(imagenUrl)}

          alt={nombre}

          className="producto-detalle__img"

        />

      </div>



      <div className="producto-detalle__info">

        <h1 className="producto-detalle__nombre">{nombre}</h1>

        <p className="producto-detalle__precio">

          {formatPrice(precio)}

        </p>

        <p className={`producto-detalle__stock${sinStock ? ' producto-detalle__stock--agotado' : ''}`}>

          {sinStock ? 'Sin stock' : `Stock disponible: ${stock}`}

        </p>



        <div className="producto-detalle__seccion">

          <h2>Descripción</h2>

          <p>{descripcion}</p>

        </div>



        <div className="producto-detalle__compra">

          <span className="producto-detalle__cantidad-label" id="cantidad-label">Cantidad</span>

          <div className="cantidad cantidad--grande" role="group" aria-labelledby="cantidad-label">

            <button

              type="button"

              className="cantidad__btn"

              onClick={() => setCantidad((n) => n - 1)}

              disabled={sinStock || cantidad <= 1}

              aria-label="Restar una unidad"

            >

              −

            </button>

            <span className="cantidad__valor" aria-live="polite">{cantidad}</span>

            <button

              type="button"

              className="cantidad__btn"

              onClick={() => setCantidad((n) => n + 1)}

              disabled={sinStock || cantidad >= cantidadMaxima}

              aria-label="Sumar una unidad"

            >

              +

            </button>

          </div>

        </div>



        <div className="producto-detalle__acciones">

          <button type="button" className="btn btn-primario" onClick={agregar} disabled={sinStock}>

            Agregar al carrito

          </button>

          {botonVolver}

          <Link to={`/admin/editar-producto/${id}`} className="btn btn-secundario">

            Editar

          </Link>

          <button

            type="button"

            className="btn btn-peligro"

            onClick={handleEliminar}

            disabled={eliminando}

            style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: eliminando ? 'not-allowed' : 'pointer' }}

          >

            {eliminando ? 'Eliminando...' : 'Eliminar'}

          </button>

        </div>

      </div>

    </section>

  );

};



export default ProductDetail;
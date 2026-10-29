import { useRef, useState } from 'react';
import '../styles/admin.css';

const CAMPOS = ['nombre', 'descripcion', 'precio', 'stock', 'imagenUrl'];

const aTexto = (valor) => (valor === undefined || valor === null ? '' : String(valor));

const estadoInicial = (valores) => ({
  nombre: aTexto(valores.nombre),
  descripcion: aTexto(valores.descripcion),
  precio: aTexto(valores.precio),
  stock: aTexto(valores.stock ?? 0),
  imagenUrl: aTexto(valores.imagenUrl),
});

const validar = ({ nombre, precio, stock, imagenUrl }) => {
  const errores = {};

  if (!nombre.trim()) errores.nombre = 'Ingresá el nombre del producto.';

  if (!precio.trim()) {
    errores.precio = 'Ingresá el precio.';
  } else if (!Number.isFinite(Number(precio))) {
    errores.precio = 'El precio tiene que ser un número.';
  } else if (Number(precio) < 0) {
    errores.precio = 'El precio no puede ser negativo.';
  }

  if (stock.trim()) {
    if (!Number.isInteger(Number(stock))) {
      errores.stock = 'El stock tiene que ser un número entero.';
    } else if (Number(stock) < 0) {
      errores.stock = 'El stock no puede ser negativo.';
    }
  }

  if (imagenUrl && !imagenUrl.trim()) {
    errores.imagenUrl = 'La ruta de la imagen no puede ser solo espacios.';
  }

  return errores;
};

const normalizar = ({ nombre, descripcion, precio, stock, imagenUrl }) => ({
  nombre: nombre.trim(),
  descripcion: descripcion.trim(),
  precio: Number(precio),
  stock: stock.trim() ? Number(stock) : 0,
  imagenUrl: imagenUrl.trim(),
});

const ProductForm = ({
  valoresIniciales = {},
  onSubmit,
  textoBoton = 'Guardar',
  enviando = false,
  errorServidor = null,
  children,
}) => {
  const [formData, setFormData] = useState(() => estadoInicial(valoresIniciales));
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((datos) => ({ ...datos, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enviando) return;

    const nuevosErrores = validar(formData);
    setErrores(nuevosErrores);
    const primerCampoConError = CAMPOS.find((campo) => nuevosErrores[campo]);
    if (primerCampoConError) {
      formRef.current.elements[primerCampoConError].focus();
      return;
    }

    onSubmit(normalizar(formData));
  };

  const propsError = (campo, idAyuda) => ({
    'aria-invalid': Boolean(errores[campo]),
    'aria-describedby':
      [idAyuda, errores[campo] && `producto-${campo}-error`].filter(Boolean).join(' ') ||
      undefined,
  });

  const mensajeError = (campo) =>
    errores[campo] && (
      <span id={`producto-${campo}-error`} className="form-error">{errores[campo]}</span>
    );

  return (
    <form ref={formRef} className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="producto-nombre">Nombre</label>
        <input
          type="text"
          id="producto-nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          {...propsError('nombre')}
        />
        {mensajeError('nombre')}
      </div>

      <div className="form-group">
        <label htmlFor="producto-descripcion">Descripción</label>
        <textarea
          id="producto-descripcion"
          name="descripcion"
          rows="4"
          value={formData.descripcion}
          onChange={handleChange}
          {...propsError('descripcion')}
        ></textarea>
        {mensajeError('descripcion')}
      </div>

      <div className="admin-form-fila">
        <div className="form-group">
          <label htmlFor="producto-precio">Precio</label>
          <input
            type="number"
            id="producto-precio"
            name="precio"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={formData.precio}
            onChange={handleChange}
            {...propsError('precio')}
          />
          {mensajeError('precio')}
        </div>

        <div className="form-group">
          <label htmlFor="producto-stock">Stock</label>
          <input
            type="number"
            id="producto-stock"
            name="stock"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.stock}
            onChange={handleChange}
            {...propsError('stock')}
          />
          {mensajeError('stock')}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="producto-imagenUrl">Imagen</label>
        <input
          type="text"
          id="producto-imagenUrl"
          name="imagenUrl"
          placeholder="catalogo/aparador-uspallata.webp"
          value={formData.imagenUrl}
          onChange={handleChange}
          {...propsError('imagenUrl', 'producto-imagenUrl-ayuda')}
        />
        <span id="producto-imagenUrl-ayuda" className="admin-form-ayuda">
          Ruta relativa al servidor o URL completa. Opcional.
        </span>
        {mensajeError('imagenUrl')}
      </div>

      {errorServidor && (
        <p className="admin-form-error-servidor" role="alert">{errorServidor}</p>
      )}

      <div className="admin-form-acciones">
        {children}
        <button type="submit" className="submit-btn admin-form-boton" disabled={enviando}>
          {enviando ? 'Enviando…' : textoBoton}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

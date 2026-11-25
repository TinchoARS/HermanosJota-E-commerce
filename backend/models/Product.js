import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
      cast: 'El precio tiene que ser un número',
    },
    stock: {
      type: Number,
      min: [0, 'El stock no puede ser negativo'],
      cast: 'El stock tiene que ser un número',
      validate: {
        validator: Number.isInteger,
        message: 'El stock tiene que ser un número entero',
      },
      default: 0,
    },
    imagenUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

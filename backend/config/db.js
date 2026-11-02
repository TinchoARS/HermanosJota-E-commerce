import mongoose from 'mongoose';

let conexion;

const connectDB = () => {
  conexion ??= mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((error) => {
      conexion = undefined;
      throw error;
    });

  return conexion;
};

export default connectDB;

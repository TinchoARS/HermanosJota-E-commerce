import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;

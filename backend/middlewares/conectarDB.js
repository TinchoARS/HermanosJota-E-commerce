import connectDB from '../config/db.js';

const conectarDB = async (req, res, next) => {
  await connectDB();
  next();
};

export default conectarDB;

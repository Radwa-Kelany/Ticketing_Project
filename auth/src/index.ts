import { app } from './app';
import mongoose from 'mongoose';

const start = async () => {
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined')
  }
  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    app.listen(3000, () => {
      console.log('listening .....');
    });
  } catch (err) {
    process.exit(1);
  }
};

start();

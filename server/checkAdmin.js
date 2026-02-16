import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const User = (await import('./src/models/User.js')).default;

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const count = await User.countDocuments({ role: 'admin' });
  console.log('ADMIN COUNT:', count);
  process.exit(0);
};

run();

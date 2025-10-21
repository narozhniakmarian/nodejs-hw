import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URL;

const test = async () => {
  try {
    await mongoose.connect(uri);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Collections in DB:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

test();

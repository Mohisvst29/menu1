import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env.local');
  }

  try {
    console.log('Connecting to MongoDB...');
    const db = await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000, // 10 seconds
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = !!db.connections[0].readyState;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}

export default dbConnect;

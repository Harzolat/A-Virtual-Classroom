import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.startsWith('mongodb')) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to MongoDB Atlas / URI at ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn('[MongoDB] Failed connecting to provided MONGODB_URI, falling back to MongoMemoryServer:', err);
    }
  }

  if (!mongoMemoryServer) {
    mongoMemoryServer = await MongoMemoryServer.create();
  }
  const memoryUri = mongoMemoryServer.getUri();
  const conn = await mongoose.connect(memoryUri);
  console.log(`[MongoDB] Connected to MongoMemoryServer at ${memoryUri}`);
  return conn;
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
}

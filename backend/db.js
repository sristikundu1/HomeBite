import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
let db = null;

export async function connectMongo() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME || 'homebite');
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    console.warn('MongoDB connection failed, running without DB:', error.message);
  }
}

export function getDb() {
  return db;
}

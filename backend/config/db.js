import { MongoClient, ServerApiVersion } from 'mongodb';

let client;
let database;

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME;

  if (!uri || !dbName) {
    console.warn('MongoDB connection skipped: MONGO_URI and MONGO_DB_NAME are required.');
    return null;
  }

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
    await client.connect();
    database = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);
    return database;
  } catch (error) {
    database = null;
    console.error('MongoDB connection failed:', error.message);
    return null;
  }
}

export function getDB() {
  if (!database) {
    throw new Error('Database is not connected. Call connectDB first.');
  }

  return database;
}

export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

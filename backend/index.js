import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongo, getDb } from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello Foody! Your Express API is ready.' });
});

app.get('/api/meals', async (req, res) => {
  try {
    const db = getDb();
    if (!db) {
      return res.json({ meals: [
        { id: 1, name: 'Homestyle Curry', description: 'Warm spices with fresh vegetables.' },
        { id: 2, name: 'Comforting Pasta', description: 'Creamy sauce with house-made bread.' }
      ] });
    }

    const meals = await db.collection('meals').find().limit(10).toArray();
    res.json({ meals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load meals.' });
  }
});

app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  await connectMongo();
});

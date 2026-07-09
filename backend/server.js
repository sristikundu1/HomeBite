import dotenv from 'dotenv';
import app from './app.js';
import { closeDB, connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

await connectDB();

const server = app.listen(PORT, () => {
  console.log(`HomeBite API server is running on port ${PORT}`);
});

async function shutdown() {
  console.log('Shutting down HomeBite API server...');
  server.close(async () => {
    await closeDB();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

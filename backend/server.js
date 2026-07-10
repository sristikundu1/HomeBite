import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { ObjectId } from 'mongodb';
import path from 'node:path';
import { Server } from 'socket.io';
import app from './app.js';
import { closeDB, connectDB, getDB } from './config/db.js';
import { conversationRoom, orderRoom, setSocketServer, userRoom } from './config/socket.js';

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(backendDirectory, '.env') });

const PORT = process.env.PORT || 4000;

const database = await connectDB();

if (database) {
  await Promise.all([
    database.collection('conversations').createIndex({ participantKey: 1 }, { unique: true }),
    database.collection('conversations').createIndex({ participantEmails: 1, lastMessageAt: -1 }),
    database.collection('messages').createIndex({ conversationId: 1, createdAt: 1 }),
    database.collection('messages').createIndex({ conversationId: 1, receiverEmail: 1, readAt: 1 })
  ]);
}

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

setSocketServer(io);

const onlineUsers = new Map();

function setOnline(email, socketId) {
  const sockets = onlineUsers.get(email) || new Set();
  sockets.add(socketId);
  onlineUsers.set(email, sockets);
}

function setOffline(email, socketId) {
  const sockets = onlineUsers.get(email);
  if (!sockets) return false;
  sockets.delete(socketId);
  if (sockets.size) return false;
  onlineUsers.delete(email);
  return true;
}

async function emitPresence(email, online) {
  try {
    const conversationList = await getDB().collection('conversations')
      .find({ participantEmails: email }, { projection: { participantEmails: 1 } })
      .toArray();
    const recipients = new Set(conversationList.flatMap((conversation) => conversation.participantEmails).filter((participant) => participant !== email));
    recipients.forEach((recipient) => io.to(userRoom(recipient)).emit('chat:presence', { email, online }));
  } catch (error) {
    console.error('Chat presence update failed:', error.message);
  }
}

io.on('connection', (socket) => {
  socket.on('join-user', (email) => {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!normalizedEmail) return;
    socket.data.userEmail = normalizedEmail;
    socket.join(userRoom(normalizedEmail));
    setOnline(normalizedEmail, socket.id);
    emitPresence(normalizedEmail, true);
  });

  socket.on('leave-user', (email) => {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!normalizedEmail) return;
    socket.leave(userRoom(normalizedEmail));
    if (setOffline(normalizedEmail, socket.id)) emitPresence(normalizedEmail, false);
  });

  socket.on('chat:join', (conversationId) => {
    if (ObjectId.isValid(conversationId)) socket.join(conversationRoom(conversationId));
  });

  socket.on('chat:leave', (conversationId) => {
    if (ObjectId.isValid(conversationId)) socket.leave(conversationRoom(conversationId));
  });

  socket.on('chat:typing', async ({ conversationId, receiverEmail, isTyping } = {}) => {
    if (!ObjectId.isValid(conversationId) || !socket.data.userEmail || typeof receiverEmail !== 'string') return;
    const normalizedReceiver = receiverEmail.trim().toLowerCase();
    const conversation = await getDB().collection('conversations').findOne({
      _id: new ObjectId(conversationId),
      participantEmails: { $all: [socket.data.userEmail, normalizedReceiver] }
    });
    if (!conversation) return;
    io.to(userRoom(normalizedReceiver)).emit('chat:typing', {
      conversationId,
      senderEmail: socket.data.userEmail,
      isTyping: Boolean(isTyping)
    });
  });

  socket.on('chat:presence:check', (email) => {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (normalizedEmail) socket.emit('chat:presence', { email: normalizedEmail, online: onlineUsers.has(normalizedEmail) });
  });

  socket.on('join-order', (orderId) => {
    if (ObjectId.isValid(orderId)) socket.join(orderRoom(orderId));
  });

  socket.on('leave-order', (orderId) => {
    if (ObjectId.isValid(orderId)) socket.leave(orderRoom(orderId));
  });

  socket.on('disconnect', () => {
    const email = socket.data.userEmail;
    if (email && setOffline(email, socket.id)) emitPresence(email, false);
  });
});

server.listen(PORT, () => {
  console.log(`HomeBite API server is running on port ${PORT}`);
});

async function shutdown() {
  console.log('Shutting down HomeBite API server...');
  io.close();
  server.close(async () => {
    await closeDB();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

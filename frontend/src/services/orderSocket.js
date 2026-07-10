import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
let socket;

export function getSocket() {
  if (!socket) {
    socket = io(socketUrl, { autoConnect: false });
  }

  return socket;
}

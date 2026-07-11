import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/';
let socket;

export function getSocket() {
  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
  }

  return socket;
}

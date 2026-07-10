let socketServer = null;

export function setSocketServer(io) {
  socketServer = io;
}

export function getSocketServer() {
  return socketServer;
}

export function orderRoom(orderId) {
  return `order:${orderId}`;
}

export function userRoom(email) {
  return `user:${String(email || '').trim().toLowerCase()}`;
}

export function conversationRoom(conversationId) {
  return `conversation:${conversationId}`;
}

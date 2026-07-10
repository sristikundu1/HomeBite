import { getDB } from '../config/db.js';
import { getSocketServer, userRoom } from '../config/socket.js';

export function normalizeNotificationEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export async function createNotificationDocument({ receiverEmail, type, title, message }) {
  const notification = {
    receiverEmail: normalizeNotificationEmail(receiverEmail),
    type: typeof type === 'string' && type.trim() ? type.trim().toLowerCase() : 'general',
    title: typeof title === 'string' ? title.trim() : '',
    message: typeof message === 'string' ? message.trim() : '',
    isRead: false,
    createdAt: new Date()
  };

  if (!notification.receiverEmail || !notification.title || !notification.message) {
    throw new Error('receiverEmail, title, and message are required');
  }

  const result = await getDB().collection('notifications').insertOne(notification);
  const savedNotification = { ...notification, _id: result.insertedId };

  getSocketServer()?.to(userRoom(notification.receiverEmail)).emit('notification:new', savedNotification);
  return savedNotification;
}

export async function notifyRecipients(recipients, notification) {
  const emails = [...new Set(recipients.map(normalizeNotificationEmail).filter(Boolean))];
  return Promise.allSettled(
    emails.map((receiverEmail) => createNotificationDocument({ ...notification, receiverEmail }))
  );
}


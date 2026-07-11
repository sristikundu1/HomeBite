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

export async function notifyAdmins(notification) {
  const admins = await getDB().collection('users')
    .find({ role: 'admin', status: { $nin: ['deleted', 'inactive', 'suspended'] } }, { projection: { email: 1 } })
    .toArray();

  return notifyRecipients(admins.map((admin) => admin.email), notification);
}

export async function syncAdminNotificationHistory(receiverEmail) {
  const email = normalizeNotificationEmail(receiverEmail);
  if (!email) return;

  const db = getDB();
  const admin = await db.collection('users').findOne(
    { email, role: 'admin', status: { $nin: ['deleted', 'inactive'] } },
    { projection: { _id: 1 } }
  );
  if (!admin) return;

  const [users, applications, orders, reviews, messages] = await Promise.all([
    db.collection('users').find(
      { role: { $ne: 'admin' }, status: { $ne: 'deleted' } },
      { projection: { name: 1, email: 1, role: 1, createdAt: 1 } }
    ).sort({ createdAt: -1 }).limit(50).toArray(),
    db.collection('chefApplications').find().sort({ createdAt: -1, submittedAt: -1, _id: -1 }).limit(50).toArray(),
    db.collection('orders').find().sort({ orderDate: -1 }).limit(50).toArray(),
    db.collection('reviews').find().sort({ date: -1 }).limit(50).toArray(),
    db.collection('messages').find({ receiverEmail: email }).sort({ createdAt: -1 }).limit(50).toArray()
  ]);

  const senderEmails = [...new Set(messages.map((message) => normalizeNotificationEmail(message.senderEmail)).filter(Boolean))];
  const senders = senderEmails.length
    ? await db.collection('users').find({ email: { $in: senderEmails } }, { projection: { email: 1, name: 1 } }).toArray()
    : [];
  const senderNames = new Map(senders.map((sender) => [normalizeNotificationEmail(sender.email), sender.name || sender.email]));

  const candidates = [
    ...users.map((user) => ({
      type: 'user',
      title: 'User registered',
      message: `${user.name || user.email} joined HomeBite as a ${user.role || 'customer'}.`,
      createdAt: user.createdAt || new Date()
    })),
    ...applications.map((application) => ({
      type: 'chef-application',
      title: 'Chef application submitted',
      message: `${application.name || application.email || 'A customer'} submitted a Become a Chef request.`,
      createdAt: application.createdAt || application.submittedAt || new Date()
    })),
    ...orders.map((order) => ({
      type: 'order',
      title: 'Platform order',
      message: `${order.customer?.name || order.customer?.email || 'A customer'} placed order ${order._id.toString().slice(-8).toUpperCase()}.`,
      createdAt: order.orderDate || new Date()
    })),
    ...reviews.map((review) => ({
      type: 'review',
      title: 'Customer review',
      message: `${review.customer?.name || review.customer?.email || 'A customer'} submitted a ${review.rating || 0}-star review.`,
      createdAt: review.date || new Date()
    })),
    ...messages.map((message) => ({
      type: 'message',
      title: `Message from ${senderNames.get(normalizeNotificationEmail(message.senderEmail)) || message.senderEmail || 'HomeBite user'}`,
      message: String(message.text || 'You received a new message.').slice(0, 120),
      createdAt: message.createdAt || new Date()
    }))
  ];

  await Promise.all(candidates.map((notification) => db.collection('notifications').updateOne(
    { receiverEmail: email, type: notification.type, title: notification.title, message: notification.message },
    { $setOnInsert: { ...notification, receiverEmail: email, isRead: false } },
    { upsert: true }
  )));
}

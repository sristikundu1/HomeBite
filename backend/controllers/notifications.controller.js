import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import {
  createNotificationDocument,
  normalizeNotificationEmail
} from '../services/notifications.service.js';

function notificationId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function notificationsCollection() {
  return getDB().collection('notifications');
}

function handleError(res, error, action) {
  console.error(`${action} failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()}`);
}

export async function createNotification(req, res) {
  try {
    const notification = await createNotificationDocument(req.body);
    return sendSuccess(res, 201, 'Notification created successfully', notification);
  } catch (error) {
    if (error.message.includes('required')) return sendError(res, 400, error.message);
    return handleError(res, error, 'Create notification');
  }
}

export async function getNotifications(req, res) {
  try {
    const receiverEmail = normalizeNotificationEmail(req.params.email);
    if (!receiverEmail) return sendError(res, 400, 'User email is required');

    const notifications = await notificationsCollection()
      .find({ receiverEmail })
      .sort({ createdAt: -1 })
      .toArray();
    return sendSuccess(res, 200, 'Notifications retrieved successfully', notifications);
  } catch (error) {
    return handleError(res, error, 'Get notifications');
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const _id = notificationId(req.params.id);
    const receiverEmail = normalizeNotificationEmail(req.query.email);
    if (!_id || !receiverEmail) return sendError(res, 400, 'Valid notification id and user email are required');

    const result = await notificationsCollection().updateOne(
      { _id, receiverEmail },
      { $set: { isRead: true } }
    );
    if (!result.matchedCount) return sendError(res, 404, 'Notification not found');

    return sendSuccess(res, 200, 'Notification marked as read', await notificationsCollection().findOne({ _id }));
  } catch (error) {
    return handleError(res, error, 'Mark notification as read');
  }
}

export async function deleteNotification(req, res) {
  try {
    const _id = notificationId(req.params.id);
    const receiverEmail = normalizeNotificationEmail(req.query.email);
    if (!_id || !receiverEmail) return sendError(res, 400, 'Valid notification id and user email are required');

    const result = await notificationsCollection().deleteOne({ _id, receiverEmail });
    if (!result.deletedCount) return sendError(res, 404, 'Notification not found');

    return sendSuccess(res, 200, 'Notification deleted successfully', { _id });
  } catch (error) {
    return handleError(res, error, 'Delete notification');
  }
}


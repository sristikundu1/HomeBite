import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const preferenceKeys = ['orderNotifications', 'newReviewNotifications', 'messages', 'promotions', 'systemUpdates'];

export async function updateChefNotificationPreferences(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'Chef email is required');
    const preferences = {};
    for (const key of preferenceKeys) {
      if (typeof req.body[key] !== 'boolean') return sendError(res, 400, `${key} must be true or false`);
      preferences[key] = req.body[key];
    }
    preferences.updatedAt = new Date();

    const result = await getDB().collection('users').updateOne(
      { email, role: 'chef' },
      { $set: { notificationPreferences: preferences } }
    );
    if (!result.matchedCount) return sendError(res, 404, 'Chef not found');
    return sendSuccess(res, 200, 'Notification preferences updated successfully', preferences);
  } catch (error) {
    console.error('Update chef notification preferences failed:', error.message);
    return sendError(res, 500, 'Failed to update notification preferences');
  }
}

export async function deactivateChef(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) return sendError(res, 400, 'Chef email is required');
    const users = getDB().collection('users');
    const chef = await users.findOne({ email, role: 'chef' });
    if (!chef) return sendError(res, 404, 'Chef not found');

    const activeOrders = await getDB().collection('orders').countDocuments({
      'chef.email': email,
      status: { $nin: ['delivered', 'rejected'] }
    });
    if (activeOrders > 0) return sendError(res, 409, 'You have active orders. Complete them before leaving.');

    const now = new Date();
    await getDB().collection('foods').updateMany(
      { chefEmail: email, status: { $ne: 'deleted' } },
      { $set: { isAvailable: false, status: 'inactive', updatedAt: now } }
    );
    await users.updateOne(
      { _id: chef._id },
      { $set: { role: 'customer', chefStatus: 'none', status: 'active', 'availability.acceptingOrders': false, updatedAt: now } }
    );
    return sendSuccess(res, 200, 'Chef profile deactivated successfully', { role: 'customer', chefStatus: 'none', status: 'active' });
  } catch (error) {
    console.error('Deactivate chef failed:', error.message);
    return sendError(res, 500, 'Failed to deactivate chef profile');
  }
}

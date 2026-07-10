import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export async function updateAdminProfile(req, res) {
  try {
    const email = String(req.params.email || '').trim().toLowerCase();
    const photo = String(req.body.photo || '').trim();
    const phone = String(req.body.phone || '').trim();
    const address = String(req.body.address || '').trim();
    const bio = String(req.body.bio || '').trim();

    if (!email) return sendError(res, 400, 'Admin email is required');
    if (photo && !/^https?:\/\//i.test(photo)) return sendError(res, 400, 'Profile photo must be a valid URL');
    if (phone && !/^[+\d][\d\s()-]{5,19}$/.test(phone)) return sendError(res, 400, 'Phone number is invalid');
    if (address.length > 300) return sendError(res, 400, 'Address must not exceed 300 characters');
    if (bio.length > 1000) return sendError(res, 400, 'Bio must not exceed 1000 characters');

    const result = await getDB().collection('users').findOneAndUpdate(
      { email, role: 'admin', status: { $ne: 'deleted' } },
      { $set: { photo, phone, address, bio, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    const admin = result?.value || result;
    if (!admin) return sendError(res, 404, 'Admin profile not found');
    return sendSuccess(res, 200, 'Admin profile updated successfully', admin);
  } catch (error) {
    console.error('Update admin profile failed:', error.message);
    return sendError(res, 500, 'Failed to update admin profile');
  }
}

const preferenceKeys = ['orderNotifications', 'userNotifications', 'chefApplicationNotifications', 'messages', 'systemUpdates'];

export async function updateAdminNotificationPreferences(req, res) {
  try {
    const email = String(req.params.email || '').trim().toLowerCase();
    if (!email) return sendError(res, 400, 'Admin email is required');
    const notificationPreferences = {};
    for (const key of preferenceKeys) {
      if (typeof req.body[key] !== 'boolean') return sendError(res, 400, `${key} must be true or false`);
      notificationPreferences[key] = req.body[key];
    }
    const result = await getDB().collection('users').findOneAndUpdate(
      { email, role: 'admin', status: { $ne: 'deleted' } },
      { $set: { notificationPreferences, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    const admin = result?.value || result;
    if (!admin) return sendError(res, 404, 'Admin profile not found');
    return sendSuccess(res, 200, 'Admin notification preferences saved successfully', notificationPreferences);
  } catch (error) {
    console.error('Update admin notification preferences failed:', error.message);
    return sendError(res, 500, 'Failed to update admin notification preferences');
  }
}

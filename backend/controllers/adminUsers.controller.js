import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const roles = ['customer', 'chef', 'admin'];
const userId = (value) => ObjectId.isValid(value) ? new ObjectId(value) : null;
const users = () => getDB().collection('users');

const projection = {
  password: 0,
  firebaseUid: 0,
  notificationPreferences: 0,
  availability: 0
};

async function updatedUser(_id) {
  return users().findOne({ _id }, { projection });
}

export async function getManagedUsers(req, res) {
  try {
    const data = await users().find({ status: { $ne: 'deleted' } }, { projection }).sort({ createdAt: -1, _id: -1 }).toArray();
    return sendSuccess(res, 200, 'Users retrieved successfully', data);
  } catch (error) {
    console.error('Get managed users failed:', error.message);
    return sendError(res, 500, 'Failed to load users');
  }
}

export async function updateManagedUserRole(req, res) {
  try {
    const _id = userId(req.params.id);
    const role = String(req.body.role || '').trim().toLowerCase();
    if (!_id || !roles.includes(role)) return sendError(res, 400, 'Valid user id and role are required');

    const existing = await users().findOne({ _id, status: { $ne: 'deleted' } });
    if (!existing) return sendError(res, 404, 'User not found');
    const chefStatus = role === 'chef' ? 'approved' : 'none';
    await users().updateOne({ _id }, { $set: { role, chefStatus, updatedAt: new Date() } });
    return sendSuccess(res, 200, 'User role updated successfully', await updatedUser(_id));
  } catch (error) {
    console.error('Update managed user role failed:', error.message);
    return sendError(res, 500, 'Failed to update user role');
  }
}

async function setUserStatus(req, res, status) {
  try {
    const _id = userId(req.params.id);
    if (!_id) return sendError(res, 400, 'Valid user id is required');
    const result = await users().updateOne(
      { _id, status: { $ne: 'deleted' } },
      { $set: { status, updatedAt: new Date() } }
    );
    if (!result.matchedCount) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, `User ${status === 'active' ? 'activated' : 'suspended'} successfully`, await updatedUser(_id));
  } catch (error) {
    console.error(`Set user ${status} failed:`, error.message);
    return sendError(res, 500, `Failed to set user ${status}`);
  }
}

export const suspendManagedUser = (req, res) => setUserStatus(req, res, 'suspended');
export const activateManagedUser = (req, res) => setUserStatus(req, res, 'active');

export async function softDeleteManagedUser(req, res) {
  try {
    const _id = userId(req.params.id);
    if (!_id) return sendError(res, 400, 'Valid user id is required');
    const now = new Date();
    const result = await users().updateOne(
      { _id, status: { $ne: 'deleted' } },
      { $set: { status: 'deleted', deletedAt: now, updatedAt: now } }
    );
    if (!result.matchedCount) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'User soft deleted successfully', { _id, status: 'deleted' });
  } catch (error) {
    console.error('Soft delete managed user failed:', error.message);
    return sendError(res, 500, 'Failed to soft delete user');
  }
}

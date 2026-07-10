import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export async function getManagedFoods(req, res) {
  try {
    const foods = await getDB()
      .collection('foods')
      .find({ status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .toArray();

    return sendSuccess(res, 200, 'Admin foods retrieved successfully', foods);
  } catch (error) {
    console.error('Get admin foods failed:', error.message);
    return sendError(res, 500, 'Failed to get admin foods');
  }
}

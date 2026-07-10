import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { buildFoodDocument, buildFoodUpdate, validateFood } from '../utils/food.js';

function foodsCollection() {
  return getDB().collection('foods');
}

function foodId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function findFood(id) {
  const _id = foodId(id);
  return _id ? foodsCollection().findOne({ _id, status: { $ne: 'deleted' } }) : null;
}

function handleError(res, error, action) {
  console.error(`${action} failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()}`);
}

export async function createFood(req, res) {
  try {
    const errors = validateFood(req.body);
    if (errors.length) return sendError(res, 400, 'Food validation failed', errors);

    const food = buildFoodDocument(req.body);
    const result = await foodsCollection().insertOne(food);
    return sendSuccess(res, 201, 'Food created successfully', { ...food, _id: result.insertedId });
  } catch (error) {
    return handleError(res, error, 'Create food');
  }
}

export async function getFoods(req, res) {
  try {
    const foods = await foodsCollection().find({ status: 'active' }).sort({ createdAt: -1 }).toArray();
    return sendSuccess(res, 200, 'Foods retrieved successfully', foods);
  } catch (error) {
    return handleError(res, error, 'Get foods');
  }
}

export async function getFoodById(req, res) {
  try {
    const food = await findFood(req.params.id);
    if (!food) return sendError(res, 404, 'Food not found');
    return sendSuccess(res, 200, 'Food retrieved successfully', food);
  } catch (error) {
    return handleError(res, error, 'Get food');
  }
}

export async function getFoodsByChef(req, res) {
  try {
    const foods = await foodsCollection()
      .find({ chefEmail: req.params.email, status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .toArray();
    return sendSuccess(res, 200, 'Chef foods retrieved successfully', foods);
  } catch (error) {
    return handleError(res, error, 'Get chef foods');
  }
}

export async function updateFood(req, res) {
  try {
    const _id = foodId(req.params.id);
    if (!_id) return sendError(res, 404, 'Food not found');

    const errors = validateFood(req.body);
    if (errors.length) return sendError(res, 400, 'Food validation failed', errors);

    const result = await foodsCollection().updateOne({ _id }, { $set: buildFoodUpdate(req.body) });
    if (!result.matchedCount) return sendError(res, 404, 'Food not found');

    return sendSuccess(res, 200, 'Food updated successfully', await foodsCollection().findOne({ _id }));
  } catch (error) {
    return handleError(res, error, 'Update food');
  }
}

export async function toggleFoodAvailability(req, res) {
  try {
    const food = await findFood(req.params.id);
    if (!food) return sendError(res, 404, 'Food not found');

    const update = { isAvailable: !food.isAvailable, updatedAt: new Date() };
    await foodsCollection().updateOne({ _id: food._id }, { $set: update });
    return sendSuccess(res, 200, 'Food availability updated successfully', { ...food, ...update });
  } catch (error) {
    return handleError(res, error, 'Update food availability');
  }
}

export async function toggleFoodArchive(req, res) {
  try {
    const food = await findFood(req.params.id);
    if (!food || food.status === 'deleted') return sendError(res, 404, 'Food not found');

    const update = {
      status: food.status === 'archived' ? 'active' : 'archived',
      updatedAt: new Date()
    };
    await foodsCollection().updateOne({ _id: food._id }, { $set: update });
    return sendSuccess(res, 200, 'Food archive status updated successfully', { ...food, ...update });
  } catch (error) {
    return handleError(res, error, 'Update food archive status');
  }
}

export async function softDeleteFood(req, res) {
  try {
    const _id = foodId(req.params.id);
    if (!_id) return sendError(res, 404, 'Food not found');

    const update = { status: 'deleted', updatedAt: new Date() };
    const result = await foodsCollection().updateOne({ _id, status: { $ne: 'deleted' } }, { $set: update });
    if (!result.matchedCount) return sendError(res, 404, 'Food not found');

    return sendSuccess(res, 200, 'Food deleted successfully', { _id, ...update });
  } catch (error) {
    return handleError(res, error, 'Delete food');
  }
}

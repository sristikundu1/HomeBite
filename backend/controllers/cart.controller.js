import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import {
  buildCartUpsert,
  cartItemIdentity,
  normalizeEmail,
  validateCartItem,
  validateQuantity
} from '../utils/cart.js';

let cartIndexPromise;

function cartCollection() {
  return getDB().collection('cart');
}

function cartItemId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

async function ensureCartIndex() {
  if (!cartIndexPromise) {
    cartIndexPromise = cartCollection()
      .createIndex({ userEmail: 1, foodId: 1 }, { unique: true, name: 'unique_user_food' })
      .catch((error) => {
        cartIndexPromise = null;
        throw error;
      });
  }

  return cartIndexPromise;
}

function handleError(res, error, action) {
  console.error(`${action} failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()}`);
}

export async function addCartItem(req, res) {
  try {
    const errors = validateCartItem(req.body);
    if (errors.length) return sendError(res, 400, 'Cart item validation failed', errors);

    await ensureCartIndex();
    const identity = cartItemIdentity(req.body);
    const result = await cartCollection().updateOne(identity, buildCartUpsert(req.body), { upsert: true });
    const item = await cartCollection().findOne(identity);
    const created = result.upsertedCount === 1;

    return sendSuccess(
      res,
      created ? 201 : 200,
      created ? 'Item added to cart successfully' : 'Cart item quantity increased successfully',
      item
    );
  } catch (error) {
    return handleError(res, error, 'Add item to cart');
  }
}

export async function getCartByUser(req, res) {
  try {
    const userEmail = normalizeEmail(req.params.email);
    if (!userEmail) return sendError(res, 400, 'User email is required');

    const items = await cartCollection().find({ userEmail }).sort({ createdAt: -1 }).toArray();
    return sendSuccess(res, 200, 'Cart retrieved successfully', items);
  } catch (error) {
    return handleError(res, error, 'Get cart');
  }
}

export async function updateCartItemQuantity(req, res) {
  try {
    const _id = cartItemId(req.params.id);
    if (!_id) return sendError(res, 400, 'Invalid cart item id');

    const errors = validateQuantity(req.body.quantity);
    if (errors.length) return sendError(res, 400, 'Quantity validation failed', errors);

    const result = await cartCollection().updateOne(
      { _id },
      [
        {
          $set: {
            quantity: req.body.quantity,
            subtotal: { $multiply: ['$price', req.body.quantity] }
          }
        }
      ]
    );

    if (!result.matchedCount) return sendError(res, 404, 'Cart item not found');
    return sendSuccess(res, 200, 'Cart item quantity updated successfully', await cartCollection().findOne({ _id }));
  } catch (error) {
    return handleError(res, error, 'Update cart item quantity');
  }
}

export async function removeCartItem(req, res) {
  try {
    const _id = cartItemId(req.params.id);
    if (!_id) return sendError(res, 400, 'Invalid cart item id');

    const result = await cartCollection().deleteOne({ _id });
    if (!result.deletedCount) return sendError(res, 404, 'Cart item not found');

    return sendSuccess(res, 200, 'Cart item removed successfully', { _id });
  } catch (error) {
    return handleError(res, error, 'Remove cart item');
  }
}

export async function clearUserCart(req, res) {
  try {
    const userEmail = normalizeEmail(req.params.email);
    if (!userEmail) return sendError(res, 400, 'User email is required');

    const result = await cartCollection().deleteMany({ userEmail });
    return sendSuccess(res, 200, 'Cart cleared successfully', { deletedCount: result.deletedCount });
  } catch (error) {
    return handleError(res, error, 'Clear cart');
  }
}


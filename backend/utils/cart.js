import { ObjectId } from 'mongodb';

const REQUIRED_CART_FIELDS = ['userEmail', 'foodId', 'chefId', 'foodName', 'foodImage', 'price', 'quantity'];

function isMissing(value) {
  return value === undefined || value === null || (typeof value === 'string' && !value.trim());
}

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function validateCartItem(data) {
  const errors = REQUIRED_CART_FIELDS
    .filter((field) => isMissing(data[field]))
    .map((field) => `${field} is required`);

  if (data.foodId && !ObjectId.isValid(data.foodId)) errors.push('foodId must be a valid ObjectId');
  if (data.chefId && !ObjectId.isValid(data.chefId)) errors.push('chefId must be a valid ObjectId');

  if (data.price !== undefined && (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0)) {
    errors.push('price must be a non-negative number');
  }

  if (data.quantity !== undefined && (!Number.isInteger(data.quantity) || data.quantity < 1)) {
    errors.push('quantity must be a positive integer');
  }

  return errors;
}

export function validateQuantity(quantity) {
  return Number.isInteger(quantity) && quantity > 0 ? [] : ['quantity must be a positive integer'];
}

export function cartItemIdentity(data) {
  return {
    userEmail: normalizeEmail(data.userEmail),
    foodId: new ObjectId(data.foodId)
  };
}

export function buildCartUpsert(data) {
  const quantity = data.quantity;

  return [
    {
      $set: {
        userEmail: normalizeEmail(data.userEmail),
        foodId: new ObjectId(data.foodId),
        chefId: new ObjectId(data.chefId),
        foodName: data.foodName.trim(),
        foodImage: data.foodImage.trim(),
        price: data.price,
        quantity: { $add: [{ $ifNull: ['$quantity', 0] }, quantity] },
        createdAt: { $ifNull: ['$createdAt', new Date()] }
      }
    },
    {
      $set: {
        subtotal: { $multiply: ['$price', '$quantity'] }
      }
    }
  ];
}


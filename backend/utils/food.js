import { ObjectId } from 'mongodb';

export const REQUIRED_FOOD_FIELDS = [
  'chefId',
  'chefName',
  'chefEmail',
  'title',
  'slug',
  'shortDescription',
  'description',
  'category',
  'cuisine',
  'ingredients',
  'price',
  'thumbnail',
  'preparationTime',
  'servingSize',
  'calories',
  'spiceLevel',
  'tags',
  'availableQuantity'
];

const EDITABLE_FOOD_FIELDS = [
  ...REQUIRED_FOOD_FIELDS,
  'chefPhoto',
  'discountPrice',
  'gallery'
];

function isMissing(value) {
  return value === undefined || value === null || (typeof value === 'string' && !value.trim());
}

export function validateFood(data) {
  const errors = REQUIRED_FOOD_FIELDS
    .filter((field) => isMissing(data[field]))
    .map((field) => `${field} is required`);

  if (data.chefId && !ObjectId.isValid(data.chefId)) errors.push('chefId must be a valid ObjectId');
  if (data.ingredients !== undefined && !Array.isArray(data.ingredients)) errors.push('ingredients must be an array');
  if (data.tags !== undefined && !Array.isArray(data.tags)) errors.push('tags must be an array');
  if (data.gallery !== undefined && !Array.isArray(data.gallery)) errors.push('gallery must be an array');

  for (const field of ['price', 'preparationTime', 'calories']) {
    if (data[field] !== undefined && (typeof data[field] !== 'number' || data[field] < 0)) {
      errors.push(`${field} must be a non-negative number`);
    }
  }

  if (data.servingSize !== undefined && (typeof data.servingSize !== 'number' || data.servingSize <= 0)) {
    errors.push('servingSize must be a positive number');
  }

  if (data.availableQuantity !== undefined && (!Number.isInteger(data.availableQuantity) || data.availableQuantity < 0)) {
    errors.push('availableQuantity must be a non-negative integer');
  }

  if (data.discountPrice !== undefined && data.discountPrice !== null) {
    if (typeof data.discountPrice !== 'number' || data.discountPrice < 0) {
      errors.push('discountPrice must be null or a non-negative number');
    } else if (typeof data.price === 'number' && data.discountPrice >= data.price) {
      errors.push('discountPrice must be lower than price');
    }
  }

  return errors;
}

export function pickFoodFields(data) {
  return EDITABLE_FOOD_FIELDS.reduce((food, field) => {
    if (data[field] !== undefined) food[field] = data[field];
    return food;
  }, {});
}

export function buildFoodDocument(data) {
  const now = new Date();

  return {
    ...pickFoodFields(data),
    chefId: new ObjectId(data.chefId),
    chefPhoto: data.chefPhoto || '',
    discountPrice: data.discountPrice ?? null,
    gallery: data.gallery || [],
    isAvailable: true,
    rating: 0,
    reviewCount: 0,
    orderCount: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now
  };
}

export function buildFoodUpdate(data) {
  return {
    ...pickFoodFields(data),
    chefId: new ObjectId(data.chefId),
    chefPhoto: data.chefPhoto || '',
    discountPrice: data.discountPrice ?? null,
    gallery: data.gallery || [],
    updatedAt: new Date()
  };
}


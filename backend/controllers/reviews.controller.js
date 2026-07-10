import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { notifyRecipients } from '../services/notifications.service.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

let reviewIndexPromise;

function reviewsCollection() {
  return getDB().collection('reviews');
}

function objectId(value) {
  const id = value?.$oid || value;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

async function ensureReviewIndex() {
  if (!reviewIndexPromise) {
    reviewIndexPromise = reviewsCollection()
      .createIndex({ orderId: 1 }, { unique: true, name: 'one_review_per_order' })
      .catch((error) => {
        reviewIndexPromise = null;
        throw error;
      });
  }

  return reviewIndexPromise;
}

async function aggregateRating(field, id) {
  const [summary] = await reviewsCollection()
    .aggregate([
      { $match: { [field]: id } },
      { $group: { _id: null, rating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ])
    .toArray();

  return {
    rating: Math.round((summary?.rating || 0) * 10) / 10,
    reviewCount: summary?.reviewCount || 0
  };
}

async function updateRatingSummaries(foodIds, chefIds) {
  await Promise.all([
    ...foodIds.map(async (foodId) => {
      const summary = await aggregateRating('foodIds', foodId);
      return getDB().collection('foods').updateOne({ _id: foodId }, { $set: summary });
    }),
    ...chefIds.map(async (chefId) => {
      const summary = await aggregateRating('chefIds', chefId);
      return getDB().collection('users').updateOne({ _id: chefId }, { $set: summary });
    })
  ]);
}

function handleError(res, error, action) {
  if (error?.code === 11000) return sendError(res, 409, 'This order has already been reviewed');
  console.error(`${action} failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()}`);
}

export async function createReview(req, res) {
  let insertedReviewId = null;
  let foodIds = [];
  let chefIds = [];

  try {
    const orderId = objectId(req.body.orderId);
    const userEmail = normalizeEmail(req.body.userEmail);
    const rating = Number(req.body.rating);
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
    const photos = Array.isArray(req.body.photos)
      ? req.body.photos.filter((photo) => typeof photo === 'string' && photo.trim()).map((photo) => photo.trim())
      : [];

    if (!orderId || !userEmail || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
      return sendError(res, 400, 'orderId, userEmail, rating from 1 to 5, and comment are required');
    }

    await ensureReviewIndex();
    const order = await getDB().collection('orders').findOne({ _id: orderId });
    if (!order || normalizeEmail(order.customer?.email) !== userEmail) {
      return sendError(res, 404, 'Delivered order not found for this customer');
    }

    if (String(order.status).toLowerCase() !== 'delivered') {
      return sendError(res, 400, 'Only delivered orders can be reviewed');
    }

    const existingReview = await reviewsCollection().findOne({ orderId });
    if (existingReview) return sendError(res, 409, 'This order has already been reviewed');

    foodIds = [...new Map(
      (order.foods || []).map((food) => {
        const id = objectId(food.foodId);
        return id ? [id.toString(), id] : null;
      }).filter(Boolean)
    ).values()];
    const chefs = Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean);
    chefIds = [...new Map(
      chefs.map((chef) => {
        const id = objectId(chef?.id);
        return id ? [id.toString(), id] : null;
      }).filter(Boolean)
    ).values()];

    const review = {
      orderId,
      customer: order.customer,
      foodIds,
      chefIds,
      rating,
      comment,
      photos,
      date: new Date()
    };

    const result = await reviewsCollection().insertOne(review);
    insertedReviewId = result.insertedId;
    await updateRatingSummaries(foodIds, chefIds);
    await getDB().collection('orders').updateOne({ _id: orderId }, { $set: { reviewed: true } });
    await notifyRecipients(chefs.map((chef) => chef?.email), {
      type: 'review',
      title: 'New customer review',
      message: `${order.customer?.name || 'A customer'} left a ${rating}-star review.`
    });

    return sendSuccess(res, 201, 'Review submitted successfully', { ...review, _id: result.insertedId });
  } catch (error) {
    if (insertedReviewId) {
      await reviewsCollection().deleteOne({ _id: insertedReviewId }).catch(() => {});
      await updateRatingSummaries(foodIds, chefIds).catch(() => {});
    }
    return handleError(res, error, 'Create review');
  }
}

export async function getFoodReviews(req, res) {
  try {
    const foodId = objectId(req.params.foodId);
    if (!foodId) return sendError(res, 400, 'Invalid food id');

    const reviews = await reviewsCollection().find({ foodIds: foodId }).sort({ date: -1 }).toArray();
    return sendSuccess(res, 200, 'Food reviews retrieved successfully', reviews);
  } catch (error) {
    return handleError(res, error, 'Get food reviews');
  }
}

export async function getOrderReview(req, res) {
  try {
    const orderId = objectId(req.params.orderId);
    if (!orderId) return sendError(res, 400, 'Invalid order id');

    const review = await reviewsCollection().findOne({ orderId });
    return sendSuccess(res, 200, 'Order review retrieved successfully', review);
  } catch (error) {
    return handleError(res, error, 'Get order review');
  }
}

export async function getChefReviews(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'Chef email is required');

    const chef = await getDB().collection('users').findOne({ email }, { projection: { _id: 1 } });
    if (!chef) return sendError(res, 404, 'Chef not found');

    const reviews = await reviewsCollection().find({ chefIds: chef._id }).sort({ date: -1 }).toArray();
    return sendSuccess(res, 200, 'Chef reviews retrieved successfully', reviews);
  } catch (error) {
    return handleError(res, error, 'Get chef reviews');
  }
}

export async function getCustomerReviews(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'Customer email is required');

    const reviews = await reviewsCollection().find({ 'customer.email': email }).sort({ date: -1 }).toArray();
    const orderIds = reviews.map((review) => review.orderId).filter(Boolean);
    const orders = orderIds.length
      ? await getDB().collection('orders').find({ _id: { $in: orderIds } }).toArray()
      : [];
    const ordersById = new Map(orders.map((order) => [order._id.toString(), order]));
    const data = reviews.map((review) => {
      const order = ordersById.get(review.orderId?.toString());
      return { ...review, foods: order?.foods || [], chef: order?.chef || [] };
    });

    return sendSuccess(res, 200, 'Customer reviews retrieved successfully', data);
  } catch (error) {
    return handleError(res, error, 'Get customer reviews');
  }
}

export async function updateReview(req, res) {
  try {
    const _id = objectId(req.params.id);
    const userEmail = normalizeEmail(req.body.userEmail);
    const rating = Number(req.body.rating);
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
    if (!_id || !userEmail || !Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 10) {
      return sendError(res, 400, 'Valid review id, customer email, rating from 1 to 5, and a comment of at least 10 characters are required');
    }

    const review = await reviewsCollection().findOne({ _id, 'customer.email': userEmail });
    if (!review) return sendError(res, 404, 'Review not found');

    await reviewsCollection().updateOne({ _id }, { $set: { rating, comment, updatedAt: new Date() } });
    await updateRatingSummaries(review.foodIds || [], review.chefIds || []);
    return sendSuccess(res, 200, 'Review updated successfully', await reviewsCollection().findOne({ _id }));
  } catch (error) {
    return handleError(res, error, 'Update review');
  }
}

export async function deleteReview(req, res) {
  try {
    const _id = objectId(req.params.id);
    const userEmail = normalizeEmail(req.query.email);
    if (!_id || !userEmail) return sendError(res, 400, 'Valid review id and customer email are required');

    const review = await reviewsCollection().findOne({ _id, 'customer.email': userEmail });
    if (!review) return sendError(res, 404, 'Review not found');

    await reviewsCollection().deleteOne({ _id });
    await Promise.all([
      updateRatingSummaries(review.foodIds || [], review.chefIds || []),
      getDB().collection('orders').updateOne({ _id: review.orderId }, { $set: { reviewed: false } })
    ]);
    return sendSuccess(res, 200, 'Review deleted successfully', { _id });
  } catch (error) {
    return handleError(res, error, 'Delete review');
  }
}

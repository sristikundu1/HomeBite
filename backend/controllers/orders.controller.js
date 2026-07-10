import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { getStripe } from '../utils/stripe.js';
import { getSocketServer, orderRoom } from '../config/socket.js';
import { notifyRecipients } from '../services/notifications.service.js';

const ORDER_STATUSES = ['pending', 'accepted', 'rejected', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
let orderIndexPromise;

function ordersCollection() {
  return getDB().collection('orders');
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function documentId(value) {
  const id = value?.$oid || value;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function money(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

async function ensureOrderIndex() {
  if (!orderIndexPromise) {
    orderIndexPromise = ordersCollection()
      .createIndex({ paymentIntentId: 1 }, { unique: true, name: 'unique_payment_intent' })
      .catch((error) => {
        orderIndexPromise = null;
        throw error;
      });
  }

  return orderIndexPromise;
}

async function buildCustomer(email, suppliedCustomer = {}) {
  const user = await getDB().collection('users').findOne({ email });

  return {
    id: user?._id || documentId(suppliedCustomer.id),
    name: user?.name || suppliedCustomer.name || '',
    email,
    photo: user?.photo || suppliedCustomer.photo || ''
  };
}

async function buildFoodsAndChefs(items) {
  const foodIds = items.map((item) => documentId(item.foodId)).filter(Boolean);
  const foodDocuments = foodIds.length
    ? await getDB().collection('foods').find({ _id: { $in: foodIds } }).toArray()
    : [];
  const foodsById = new Map(foodDocuments.map((food) => [food._id.toString(), food]));
  const chefsById = new Map();

  const foods = items.map((item) => {
    const foodId = documentId(item.foodId);
    const food = foodId ? foodsById.get(foodId.toString()) : null;
    const chefId = food?.chefId || documentId(item.chefId);

    if (chefId) {
      chefsById.set(chefId.toString(), {
        id: chefId,
        name: food?.chefName || item.chefName || '',
        email: normalizeEmail(food?.chefEmail || item.chefEmail),
        photo: food?.chefPhoto || item.chefPhoto || ''
      });
    }

    const price = money(item.price ?? food?.discountPrice ?? food?.price);
    const quantity = Number(item.quantity);

    return {
      foodId,
      name: item.foodName || food?.title || '',
      image: item.foodImage || food?.thumbnail || '',
      price,
      quantity,
      subtotal: money(price * quantity)
    };
  });

  const chefs = [...chefsById.values()];
  return {
    foods,
    chef: chefs.length === 1 ? chefs[0] : chefs
  };
}

function validFoods(foods) {
  return foods.length > 0 && foods.every(
    (food) => food.foodId && food.name && Number.isInteger(food.quantity) && food.quantity > 0 && food.price >= 0
  );
}

function handleError(res, error, action) {
  if (error?.code === 11000) {
    return sendError(res, 409, 'An order already exists for this payment');
  }

  console.error(`${action} failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()}`);
}

export async function createOrder(req, res) {
  try {
    const userEmail = normalizeEmail(req.body.userEmail || req.body.customer?.email);
    const items = req.body.items || req.body.foods;
    const shippingAddress = req.body.shippingAddress || req.body.shipping;
    const { paymentIntentId } = req.body;

    if (!userEmail || !Array.isArray(items) || !items.length || !shippingAddress || !paymentIntentId) {
      return sendError(res, 400, 'Customer email, foods, shippingAddress, and paymentIntentId are required');
    }

    await ensureOrderIndex();
    const existingOrder = await ordersCollection().findOne({ paymentIntentId });
    if (existingOrder) return sendSuccess(res, 200, 'Order already created', existingOrder);

    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return sendError(res, 400, 'Order can only be created after successful payment');
    }

    const { foods, chef } = await buildFoodsAndChefs(items);
    if (!validFoods(foods)) return sendError(res, 400, 'Order contains invalid food items');

    const subtotal = money(foods.reduce((sum, food) => sum + food.subtotal, 0));
    const total = money(paymentIntent.amount / 100);
    const tax = money(req.body.tax ?? subtotal * 0.05);
    const deliveryFee = money(req.body.deliveryFee ?? Math.max(0, total - subtotal - tax));
    const transactionId = typeof paymentIntent.latest_charge === 'string'
      ? paymentIntent.latest_charge
      : paymentIntent.latest_charge?.id || paymentIntent.id;

    const order = {
      customer: await buildCustomer(userEmail, req.body.customer),
      chef,
      foods,
      shippingAddress,
      paymentIntentId,
      transactionId,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      orderDate: new Date(),
      paymentStatus: 'paid'
    };

    const result = await ordersCollection().insertOne(order);
    const chefs = Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean);
    await notifyRecipients(
      chefs.map((chef) => chef.email),
      {
        type: 'order',
        title: 'New Order Received',
        message: `${order.customer.name || 'A customer'} placed a new order.`
      }
    );
    return sendSuccess(res, 201, 'Order created successfully', { ...order, _id: result.insertedId });
  } catch (error) {
    return handleError(res, error, 'Create order');
  }
}

export async function getCustomerOrders(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'Customer email is required');

    const orders = await ordersCollection().find({ 'customer.email': email }).sort({ orderDate: -1 }).toArray();
    return sendSuccess(res, 200, 'Customer orders retrieved successfully', orders);
  } catch (error) {
    return handleError(res, error, 'Get customer orders');
  }
}

export async function getChefOrders(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'Chef email is required');

    const orders = await ordersCollection().find({ 'chef.email': email }).sort({ orderDate: -1 }).toArray();
    return sendSuccess(res, 200, 'Chef orders retrieved successfully', orders);
  } catch (error) {
    return handleError(res, error, 'Get chef orders');
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await ordersCollection().find().sort({ orderDate: -1 }).toArray();
    return sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    return handleError(res, error, 'Get orders');
  }
}

export async function getOrderById(req, res) {
  try {
    const _id = documentId(req.params.id);
    if (!_id) return sendError(res, 400, 'Invalid order id');

    const order = await ordersCollection().findOne({ _id });
    if (!order) return sendError(res, 404, 'Order not found');

    return sendSuccess(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    return handleError(res, error, 'Get order');
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const _id = documentId(req.params.id);
    if (!_id) return sendError(res, 400, 'Invalid order id');

    const status = typeof req.body.status === 'string'
      ? req.body.status.trim().toLowerCase().replace(/[\s_]+/g, '-')
      : '';
    if (!ORDER_STATUSES.includes(status)) {
      return sendError(res, 400, `status must be one of: ${ORDER_STATUSES.join(', ')}`);
    }

    const statusUpdatedAt = new Date();
    const result = await ordersCollection().updateOne({ _id }, { $set: { status, statusUpdatedAt } });
    if (!result.matchedCount) return sendError(res, 404, 'Order not found');

    const order = await ordersCollection().findOne({ _id });
    getSocketServer()?.to(orderRoom(_id.toString())).emit('order-status-updated', {
      orderId: _id.toString(),
      status,
      statusUpdatedAt
    });

    const statusTitles = {
      accepted: 'Order Accepted',
      rejected: 'Order Rejected',
      preparing: 'Order Is Being Prepared',
      ready: 'Order Is Ready',
      'out-for-delivery': 'Order Is Out For Delivery',
      delivered: 'Order Delivered'
    };
    const chefs = Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean);
    const chefNames = chefs.map((chef) => chef.name).filter(Boolean).join(', ');
    await notifyRecipients(
      [order.customer?.email],
      {
        type: 'order',
        title: statusTitles[status] || 'Order Status Updated',
        message: `${chefNames || 'Your chef'} updated your order to ${status.replaceAll('-', ' ')}.`
      }
    );

    return sendSuccess(res, 200, 'Order status updated successfully', order);
  } catch (error) {
    return handleError(res, error, 'Update order status');
  }
}

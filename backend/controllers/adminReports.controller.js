import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const TYPES = ['orders', 'revenue', 'customers', 'chefs', 'foods', 'reviews', 'payments'];
const normalize = (value) => String(value || '').trim().toLowerCase();
const id = (value) => value?.toString?.() || String(value || '');
const chefs = (order) => Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean);
const inRange = (value, start, end) => { if (!value) return !start && !end; const date = new Date(value); return (!start || date >= start) && (!end || date <= end); };
const contains = (values, query) => !query || values.filter(Boolean).join(' ').toLowerCase().includes(query);

function dates(filters) {
  const start = filters.startDate ? new Date(filters.startDate) : null;
  const end = filters.endDate ? new Date(filters.endDate) : null;
  if (start && Number.isNaN(start.getTime())) throw new Error('Start date is invalid');
  if (end && Number.isNaN(end.getTime())) throw new Error('End date is invalid');
  if (end) end.setHours(23, 59, 59, 999);
  if (start && end && start > end) throw new Error('Start date cannot be after end date');
  return { start, end };
}

async function orderRows(db, filters) {
  const { start, end } = dates(filters); const query = normalize(filters.search);
  const rows = await db.collection('orders').find().sort({ orderDate: -1 }).toArray();
  return rows.filter((order) => inRange(order.orderDate, start, end)
    && (!filters.status || normalize(order.status) === normalize(filters.status))
    && (!filters.paymentStatus || normalize(order.paymentStatus) === normalize(filters.paymentStatus))
    && (!filters.chef || chefs(order).some((chef) => normalize(chef.email) === normalize(filters.chef)))
    && (!filters.customer || normalize(order.customer?.email) === normalize(filters.customer))
    && contains([id(order._id), order.customer?.name, order.customer?.email, ...chefs(order).flatMap((chef) => [chef.name, chef.email]), ...(order.foods || []).map((food) => food.name)], query))
    .map((order) => ({ id: id(order._id), transactionId: order.transactionId, paymentIntentId: order.paymentIntentId, customer: order.customer?.name || order.customer?.email || 'Customer', customerEmail: order.customer?.email || '', chef: chefs(order).map((chef) => chef.name || chef.email).join(', ') || 'Unknown', total: Number(order.total || 0), status: order.status || 'pending', payment: order.paymentStatus || 'pending', createdDate: order.orderDate }));
}

async function revenueRows(db, filters) {
  const orders = await orderRows(db, { ...filters, paymentStatus: filters.paymentStatus || 'paid' });
  const grouped = new Map();
  orders.forEach((order) => { const key = new Date(order.createdDate).toISOString().slice(0, 10); const row = grouped.get(key) || { date: key, revenue: 0, orders: 0 }; row.revenue += order.total; row.orders += 1; grouped.set(key, row); });
  return [...grouped.values()].sort((a, b) => b.date.localeCompare(a.date)).map((row) => ({ ...row, averageOrderValue: row.orders ? row.revenue / row.orders : 0 }));
}

async function customerRows(db, filters) {
  const { start, end } = dates(filters); const query = normalize(filters.search);
  const users = await db.collection('users').find({ role: filters.role || 'customer', status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();
  const orders = await db.collection('orders').find({ paymentStatus: 'paid' }).toArray();
  return users.filter((user) => inRange(user.createdAt, start, end) && (!filters.customer || normalize(user.email) === normalize(filters.customer)) && contains([user.name, user.email, user.phone], query)).map((user) => { const related = orders.filter((order) => normalize(order.customer?.email) === normalize(user.email)); return { name: user.name || 'Customer', email: user.email, orders: related.length, spent: related.reduce((sum, order) => sum + Number(order.total || 0), 0), joinedDate: user.createdAt }; });
}

async function chefRows(db, filters) {
  const { start, end } = dates(filters); const query = normalize(filters.search);
  const users = await db.collection('users').find({ role: 'chef', status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();
  const orders = await db.collection('orders').find({ paymentStatus: 'paid' }).toArray();
  return users.filter((user) => inRange(user.createdAt, start, end) && (!filters.status || normalize(user.chefStatus) === normalize(filters.status)) && (!filters.chef || normalize(user.email) === normalize(filters.chef)) && contains([user.name, user.email, user.chefProfile?.kitchenName], query)).map((user) => { const related = orders.filter((order) => chefs(order).some((chef) => normalize(chef.email) === normalize(user.email))); return { kitchenName: user.chefProfile?.kitchenName || `${user.name || 'Chef'}'s Kitchen`, email: user.email, orders: related.length, revenue: related.reduce((sum, order) => sum + Number(order.total || 0), 0), rating: Number(user.rating || 0), verificationStatus: user.chefStatus || 'none' }; });
}

async function foodRows(db, filters) {
  const { start, end } = dates(filters); const query = normalize(filters.search);
  const rows = await db.collection('foods').find({ status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();
  return rows.filter((food) => inRange(food.createdAt, start, end) && (!filters.status || normalize(food.status) === normalize(filters.status)) && (!filters.category || normalize(food.category) === normalize(filters.category)) && (!filters.chef || normalize(food.chefEmail) === normalize(filters.chef)) && contains([food.title, food.chefName, food.chefEmail, food.category], query)).map((food) => ({ foodName: food.title, chef: food.chefName || food.chefEmail, category: food.category || 'Uncategorized', price: Number(food.discountPrice || food.price || 0), orders: Number(food.orderCount || 0), rating: Number(food.rating || 0), availability: food.isAvailable ? 'Available' : 'Unavailable' }));
}

async function paymentRows(db, filters) {
  const orders = await orderRows(db, filters);
  return orders.map((order) => ({ transactionId: order.transactionId || order.paymentIntentId || order.id, customer: order.customer, amount: order.total, method: 'Card', status: order.payment, date: order.createdDate }));
}

async function reviewRows(db, filters) {
  const { start, end } = dates(filters); const query = normalize(filters.search);
  const reviews = await db.collection('reviews').find().sort({ date: -1 }).toArray();
  const orderIds = reviews.map((review) => review.orderId).filter(Boolean);
  const orders = orderIds.length ? await db.collection('orders').find({ _id: { $in: orderIds } }).toArray() : [];
  const byId = new Map(orders.map((order) => [id(order._id), order]));
  return reviews.map((review) => ({ review, order: byId.get(id(review.orderId)) })).filter(({ review, order }) => inRange(review.date, start, end) && (!filters.chef || chefs(order || {}).some((chef) => normalize(chef.email) === normalize(filters.chef))) && (!filters.customer || normalize(review.customer?.email) === normalize(filters.customer)) && contains([review.customer?.name, review.customer?.email, review.comment, ...(order?.foods || []).map((food) => food.name), ...chefs(order || {}).map((chef) => chef.name)], query)).map(({ review, order }) => ({ food: order?.foods?.map((food) => food.name).join(', ') || 'Food', chef: chefs(order || {}).map((chef) => chef.name || chef.email).join(', ') || 'Chef', customer: review.customer?.name || review.customer?.email || 'Customer', rating: review.rating, reviewDate: review.date }));
}

async function generateRows(db, type, filters) {
  return ({ orders: orderRows, revenue: revenueRows, customers: customerRows, chefs: chefRows, foods: foodRows, reviews: reviewRows, payments: paymentRows })[type](db, filters);
}

export async function getReportBootstrap(req, res) {
  try {
    const db = getDB();
    const [chefsList, customers, categories, recentReports] = await Promise.all([
      db.collection('users').find({ role: 'chef', status: { $ne: 'deleted' } }, { projection: { name: 1, email: 1, chefProfile: 1 } }).sort({ name: 1 }).toArray(),
      db.collection('users').find({ role: 'customer', status: { $ne: 'deleted' } }, { projection: { name: 1, email: 1 } }).sort({ name: 1 }).toArray(),
      db.collection('foods').distinct('category', { status: { $ne: 'deleted' } }),
      db.collection('reportRuns').find().sort({ generatedAt: -1 }).limit(8).toArray()
    ]);
    return sendSuccess(res, 200, 'Report options retrieved successfully', { chefs: chefsList.map((chef) => ({ email: chef.email, name: chef.chefProfile?.kitchenName || chef.name || chef.email })), customers: customers.map((customer) => ({ email: customer.email, name: customer.name || customer.email })), categories: categories.filter(Boolean).sort(), recentReports });
  } catch (error) { console.error('Get report bootstrap failed:', error.message); return sendError(res, 500, 'Failed to load report options'); }
}

export async function generateReport(req, res) {
  try {
    const type = normalize(req.body.reportType); const filters = req.body.filters || {};
    if (!TYPES.includes(type)) return sendError(res, 400, 'A valid report type is required');
    const db = getDB(); const rows = await generateRows(db, type, filters);
    const report = { reportType: type, filters, rowCount: rows.length, generatedAt: new Date() };
    const result = await db.collection('reportRuns').insertOne(report);
    return sendSuccess(res, 200, 'Report generated successfully', { rows, report: { ...report, _id: result.insertedId } });
  } catch (error) {
    if (/date|valid|required/i.test(error.message)) return sendError(res, 400, error.message);
    console.error('Generate report failed:', error.message); return sendError(res, 500, 'Failed to generate report');
  }
}

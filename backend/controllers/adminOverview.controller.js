import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const inactiveStatuses = ['delivered', 'rejected', 'cancelled'];

function monthRows(rows, valueKey) {
  const values = new Map(rows.map((row) => [row._id, Number(row[valueKey] || 0)]));
  const formatter = new Intl.DateTimeFormat('en', { month: 'short' });
  return Array.from({ length: 12 }, (_, offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - offset), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return { key, month: formatter.format(date), value: values.get(key) || 0 };
  });
}

export async function getAdminOverview(req, res) {
  try {
    const db = getDB();
    const users = db.collection('users');
    const foods = db.collection('foods');
    const orders = db.collection('orders');
    const reviews = db.collection('reviews');
    const applications = db.collection('chefApplications');
    const activeUsers = { status: { $nin: ['deleted', 'inactive'] } };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const adminEmail = String(req.query.email || '').trim().toLowerCase();

    const [
      totalUsers,
      customers,
      chefs,
      pendingApplications,
      totalFoods,
      totalOrders,
      activeOrders,
      revenueRows,
      statusRows,
      growthRows,
      categoryRows,
      latestOrders,
      latestUsers,
      latestReviews,
      todayOrders,
      todayRevenueRows,
      newUsersToday,
      unreadMessages
    ] = await Promise.all([
      users.countDocuments(activeUsers),
      users.countDocuments({ ...activeUsers, role: 'customer' }),
      users.countDocuments({ ...activeUsers, role: 'chef' }),
      applications.countDocuments({ status: 'pending' }),
      foods.countDocuments({ status: { $ne: 'deleted' } }),
      orders.countDocuments(),
      orders.countDocuments({ status: { $nin: inactiveStatuses } }),
      orders.aggregate([
        { $match: { paymentStatus: 'paid', orderDate: { $type: 'date' } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$orderDate' } }, revenue: { $sum: '$total' } } }
      ]).toArray(),
      orders.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
      users.aggregate([
        { $match: { ...activeUsers, createdAt: { $type: 'date' } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, users: { $sum: 1 } } }
      ]).toArray(),
      foods.aggregate([
        { $match: { status: { $ne: 'deleted' }, category: { $type: 'string', $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 7 }
      ]).toArray(),
      orders.find().sort({ orderDate: -1 }).limit(5).toArray(),
      users.find(activeUsers, { projection: { name: 1, email: 1, photo: 1, role: 1, chefStatus: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(5).toArray(),
      reviews.find().sort({ date: -1 }).limit(5).toArray()
      ,orders.countDocuments({ orderDate: { $gte: today } })
      ,orders.aggregate([{ $match: { paymentStatus: 'paid', orderDate: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' } } }]).toArray()
      ,users.countDocuments({ ...activeUsers, createdAt: { $gte: today } })
      ,adminEmail ? db.collection('messages').countDocuments({ receiverEmail: adminEmail, readAt: null }) : 0
    ]);

    const totalRevenue = revenueRows.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
    const reviewOrderIds = latestReviews.map((review) => review.orderId).filter(Boolean);
    const reviewOrders = reviewOrderIds.length
      ? await orders.find({ _id: { $in: reviewOrderIds } }, { projection: { foods: 1, chef: 1 } }).toArray()
      : [];
    const ordersById = new Map(reviewOrders.map((order) => [order._id.toString(), order]));

    return sendSuccess(res, 200, 'Admin overview retrieved successfully', {
      stats: {
        totalUsers, customers, chefs, pendingApplications, totalFoods, totalOrders, totalRevenue, activeOrders,
        todayOrders, todayRevenue: Number(todayRevenueRows[0]?.total || 0), newUsersToday,
        ordersWaitingForChef: statusRows.find((row) => row._id === 'pending')?.count || 0,
        unreadMessages
      },
      charts: {
        monthlyRevenue: monthRows(revenueRows, 'revenue'),
        ordersByStatus: statusRows.map((row) => ({ status: row._id || 'unknown', count: row.count })),
        userGrowth: monthRows(growthRows, 'users'),
        topCategories: categoryRows.map((row) => ({ category: row._id, count: row.count }))
      },
      recent: {
        orders: latestOrders,
        users: latestUsers,
        reviews: latestReviews.map((review) => {
          const order = ordersById.get(review.orderId?.toString());
          return { ...review, food: order?.foods?.[0] || null, chef: Array.isArray(order?.chef) ? order.chef[0] : order?.chef || null };
        })
      },
      health: {
        backend: true,
        mongodb: true,
        stripe: Boolean(process.env.STRIPE_SECRET_KEY),
        lastSync: new Date()
      }
    });
  } catch (error) {
    console.error('Get admin overview failed:', error.message);
    return sendError(res, 500, 'Failed to load admin overview');
  }
}

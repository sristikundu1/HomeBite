import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const normalize = (value) => String(value || '').trim().toLowerCase();
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const approvedQuery = { role: 'chef', chefStatus: 'approved', status: { $nin: ['deleted', 'inactive', 'suspended'] } };

function profileValue(user, key, fallback = '') {
  return user.chefProfile?.[key] ?? fallback;
}

async function enrichChefs(users) {
  if (!users.length) return [];
  const db = getDB();
  const emails = users.map((user) => normalize(user.email));
  const ids = users.map((user) => user._id);
  const [foods, orders, reviews, applications] = await Promise.all([
    db.collection('foods').find({ chefEmail: { $in: emails }, status: 'active' }).toArray(),
    db.collection('orders').find({ 'chef.email': { $in: emails } }).toArray(),
    db.collection('reviews').find({ chefIds: { $in: ids } }).sort({ date: -1 }).toArray(),
    db.collection('chefApplications').find({ $or: [{ userId: { $in: ids } }, { email: { $in: emails } }] }).sort({ submittedAt: -1 }).toArray()
  ]);

  return users.map((user) => {
    const email = normalize(user.email);
    const chefFoods = foods.filter((food) => normalize(food.chefEmail) === email);
    const chefOrders = orders.filter((order) => {
      const chefs = Array.isArray(order.chef) ? order.chef : [order.chef].filter(Boolean);
      return chefs.some((chef) => normalize(chef.email) === email);
    });
    const chefReviews = reviews.filter((review) => (review.chefIds || []).some((id) => String(id) === String(user._id)));
    const application = applications.find((item) => String(item.userId || '') === String(user._id) || normalize(item.email) === email);
    const averageRating = chefReviews.length
      ? Math.round((chefReviews.reduce((sum, review) => sum + number(review.rating), 0) / chefReviews.length) * 10) / 10
      : number(user.rating);
    const completedOrders = chefOrders.filter((order) => normalize(order.status) === 'delivered').length;
    const savedSpecialties = profileValue(user, 'cuisineSpecialties');
    const cuisineSpecialties = Array.isArray(savedSpecialties) && savedSpecialties.length
      ? savedSpecialties
      : Array.isArray(application?.specialties) ? application.specialties : [];
    const prices = chefFoods.map((food) => number(food.discountPrice ?? food.price)).filter((price) => price > 0);

    return {
      _id: user._id,
      email,
      chefName: profileValue(user, 'fullName', user.name || email),
      profilePhoto: profileValue(user, 'profilePhoto', user.photo || ''),
      kitchenCoverImage: profileValue(user, 'kitchenCoverImage'),
      kitchenName: profileValue(user, 'kitchenName', `${user.name || 'Chef'}'s Kitchen`),
      kitchenDescription: profileValue(user, 'kitchenDescription'),
      cuisineSpecialties,
      yearsOfExperience: number(profileValue(user, 'yearsOfExperience', application?.experience)),
      preparationStyle: profileValue(user, 'preparationStyle'),
      deliveryRadius: profileValue(user, 'deliveryRadius'),
      bio: profileValue(user, 'bio', application?.bio || ''),
      cookingPhilosophy: profileValue(user, 'cookingPhilosophy', profileValue(user, 'preparationStyle')),
      achievements: Array.isArray(profileValue(user, 'achievements')) ? profileValue(user, 'achievements') : [],
      city: profileValue(user, 'city', application?.location || ''),
      country: profileValue(user, 'country', 'Bangladesh'),
      address: profileValue(user, 'address', application?.location || ''),
      operatingHours: profileValue(user, 'operatingHours', user.availability || null),
      deliveryAreas: Array.isArray(profileValue(user, 'deliveryAreas')) ? profileValue(user, 'deliveryAreas') : [],
      averagePreparationTime: profileValue(user, 'averagePreparationTime'),
      minimumOrder: profileValue(user, 'minimumOrder'),
      socialLinks: profileValue(user, 'socialLinks', {}),
      availability: user.availability || {},
      verificationStatus: 'approved',
      averageRating,
      reviewCount: chefReviews.length,
      completedOrders,
      totalFoods: chefFoods.length,
      startingPrice: prices.length ? Math.min(...prices) : null,
      joinedDate: user.createdAt || null,
      createdAt: user.createdAt || null
    };
  });
}

function filterAndSort(chefs, query) {
  const search = normalize(query.search);
  const cuisine = normalize(query.cuisine);
  const location = normalize(query.location);
  const minimumExperience = number(query.experience);
  const minimumRating = number(query.rating);
  const availability = normalize(query.availability);

  const filtered = chefs.filter((chef) => {
    const searchable = [chef.chefName, chef.kitchenName, chef.bio, chef.city, chef.country, ...chef.cuisineSpecialties].join(' ').toLowerCase();
    return (!search || searchable.includes(search))
      && (!cuisine || chef.cuisineSpecialties.some((item) => normalize(item).includes(cuisine)))
      && (!location || [chef.city, chef.country, chef.address].join(' ').toLowerCase().includes(location))
      && (!minimumExperience || chef.yearsOfExperience >= minimumExperience)
      && (!minimumRating || chef.averageRating >= minimumRating)
      && (availability !== 'available' || (chef.availability.acceptingOrders && !chef.availability.vacationMode));
  });

  const sort = normalize(query.sort);
  return filtered.sort((a, b) => {
    if (sort === 'most-orders') return b.completedOrders - a.completedOrders || b.averageRating - a.averageRating;
    if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sort === 'alphabetical') return a.kitchenName.localeCompare(b.kitchenName);
    return b.averageRating - a.averageRating || b.completedOrders - a.completedOrders;
  });
}

export async function getFeaturedChefs(req, res) {
  try {
    const users = await getDB().collection('users').find(approvedQuery).toArray();
    const chefs = filterAndSort(await enrichChefs(users), { sort: 'highest-rated' }).slice(0, 3);
    return sendSuccess(res, 200, 'Featured chefs retrieved successfully', chefs);
  } catch (error) {
    console.error('Get featured chefs failed:', error.message);
    return sendError(res, 500, 'Failed to get featured chefs');
  }
}

export async function getChefs(req, res) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, Number.parseInt(req.query.limit, 10) || 9));
    const users = await getDB().collection('users').find(approvedQuery).toArray();
    const chefs = filterAndSort(await enrichChefs(users), req.query);
    const total = chefs.length;
    return sendSuccess(res, 200, 'Chefs retrieved successfully', {
      chefs: chefs.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
    });
  } catch (error) {
    console.error('Get chefs failed:', error.message);
    return sendError(res, 500, 'Failed to get chefs');
  }
}

export async function getChefById(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) return sendError(res, 400, 'Invalid chef id');
    const user = await getDB().collection('users').findOne({ _id: new ObjectId(req.params.id), ...approvedQuery });
    if (!user) return sendError(res, 404, 'Chef not found');
    const [chef] = await enrichChefs([user]);
    const db = getDB();
    const [foods, reviews, relatedUsers] = await Promise.all([
      db.collection('foods').find({ chefEmail: chef.email, status: 'active' }).sort({ createdAt: -1 }).toArray(),
      db.collection('reviews').find({ chefIds: user._id }).sort({ date: -1 }).limit(20).toArray(),
      db.collection('users').find({ ...approvedQuery, _id: { $ne: user._id } }).toArray()
    ]);
    const related = (await enrichChefs(relatedUsers)).filter((item) => item.cuisineSpecialties.some((cuisine) => chef.cuisineSpecialties.map(normalize).includes(normalize(cuisine)))).slice(0, 3);
    return sendSuccess(res, 200, 'Chef retrieved successfully', { chef, foods, reviews, relatedChefs: related });
  } catch (error) {
    console.error('Get chef failed:', error.message);
    return sendError(res, 500, 'Failed to get chef');
  }
}

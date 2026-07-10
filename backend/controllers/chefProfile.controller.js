import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

function users() { return getDB().collection('users'); }

function parseExperience(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number >= 0 ? number : '';
}

async function latestApplication(user) {
  return getDB().collection('chefApplications').findOne(
    { $or: [{ userId: user._id }, { email: normalizeEmail(user.email) }] },
    { sort: { submittedAt: -1 } }
  );
}

function profileFrom(user, application) {
  const saved = user.chefProfile || {};
  const specialties = Array.isArray(saved.cuisineSpecialties) && saved.cuisineSpecialties.length
    ? saved.cuisineSpecialties
    : Array.isArray(application?.specialties) ? application.specialties : [];

  return {
    _id: user._id,
    email: normalizeEmail(user.email),
    profilePhoto: saved.profilePhoto || user.photo || application?.documents?.[0] || '',
    fullName: saved.fullName || user.name || application?.name || '',
    phone: saved.phone || application?.phone || '',
    address: saved.address || application?.location || '',
    city: saved.city || '',
    country: saved.country || 'Bangladesh',
    kitchenName: saved.kitchenName || `${user.name || application?.name || 'Chef'}'s Kitchen`,
    kitchenDescription: saved.kitchenDescription || '',
    cuisineSpecialties: specialties,
    yearsOfExperience: saved.yearsOfExperience ?? parseExperience(application?.experience),
    preparationStyle: saved.preparationStyle || 'Traditional home cooking',
    deliveryRadius: saved.deliveryRadius ?? '',
    bio: saved.bio || application?.bio || '',
    chefStatus: user.status || 'active',
    verificationStatus: user.chefStatus || application?.status || 'pending',
    updatedAt: saved.updatedAt || user.updatedAt || null
  };
}

async function professionalStats(user) {
  const email = normalizeEmail(user.email);
  const [ratingSummary, completedOrders, totalFoods] = await Promise.all([
    getDB().collection('reviews').aggregate([
      { $match: { chefIds: user._id } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]).toArray(),
    getDB().collection('orders').countDocuments({ 'chef.email': email, status: 'delivered' }),
    getDB().collection('foods').countDocuments({ chefEmail: email, status: { $ne: 'deleted' } })
  ]);
  return {
    averageRating: Math.round((ratingSummary[0]?.averageRating || 0) * 10) / 10,
    reviewCount: ratingSummary[0]?.reviewCount || 0,
    completedOrders,
    totalFoods
  };
}

async function completeProfile(user) {
  const [application, stats] = await Promise.all([latestApplication(user), professionalStats(user)]);
  return { ...profileFrom(user, application), stats };
}

function validateProfile(payload) {
  const errors = [];
  const cuisines = Array.isArray(payload.cuisineSpecialties)
    ? payload.cuisineSpecialties.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const experience = Number(payload.yearsOfExperience);
  const radius = payload.deliveryRadius === '' || payload.deliveryRadius == null ? '' : Number(payload.deliveryRadius);

  if (!String(payload.kitchenName || '').trim()) errors.push('Kitchen name is required');
  if (String(payload.bio || '').trim().length < 50) errors.push('Bio must be at least 50 characters');
  if (!cuisines.length) errors.push('At least one cuisine specialty is required');
  if (!Number.isFinite(experience) || experience < 0) errors.push('Years of experience is required');
  if (radius !== '' && (!Number.isFinite(radius) || radius < 0)) errors.push('Delivery radius must be a positive number');

  return { errors, cuisines, experience, radius };
}

export async function getChefProfile(req, res) {
  try {
    const email = normalizeEmail(req.params.email);
    if (!email) return sendError(res, 400, 'Chef email is required');
    const chef = await users().findOne({ email, role: 'chef' });
    if (!chef) return sendError(res, 404, 'Chef profile not found');
    return sendSuccess(res, 200, 'Chef profile retrieved successfully', await completeProfile(chef));
  } catch (error) {
    console.error('Get chef profile failed:', error.message);
    return sendError(res, 500, 'Failed to get chef profile');
  }
}

export async function updateChefProfile(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) return sendError(res, 400, 'Invalid chef id');
    const _id = new ObjectId(req.params.id);
    const chef = await users().findOne({ _id, role: 'chef' });
    if (!chef) return sendError(res, 404, 'Chef profile not found');

    const { errors, cuisines, experience, radius } = validateProfile(req.body);
    if (errors.length) return sendError(res, 400, 'Chef profile validation failed', errors);

    const now = new Date();
    const chefProfile = {
      profilePhoto: String(req.body.profilePhoto || '').trim(),
      fullName: String(req.body.fullName || '').trim(),
      phone: String(req.body.phone || '').trim(),
      address: String(req.body.address || '').trim(),
      city: String(req.body.city || '').trim(),
      country: String(req.body.country || '').trim(),
      kitchenName: String(req.body.kitchenName).trim(),
      kitchenDescription: String(req.body.kitchenDescription || '').trim(),
      cuisineSpecialties: cuisines,
      yearsOfExperience: experience,
      preparationStyle: String(req.body.preparationStyle || '').trim(),
      deliveryRadius: radius,
      bio: String(req.body.bio).trim(),
      updatedAt: now
    };

    await users().updateOne(
      { _id },
      { $set: { chefProfile, name: chefProfile.fullName || chef.name, photo: chefProfile.profilePhoto || chef.photo, updatedAt: now } }
    );
    return sendSuccess(res, 200, 'Chef profile updated successfully', await completeProfile(await users().findOne({ _id })));
  } catch (error) {
    console.error('Update chef profile failed:', error.message);
    return sendError(res, 500, 'Failed to update chef profile');
  }
}

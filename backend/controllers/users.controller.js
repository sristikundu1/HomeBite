import { getDB } from '../config/db.js';
import { notifyAdmins } from '../services/notifications.service.js';

function getUsersCollection() {
  return getDB().collection('users');
}

function buildUserDocument({ name, email, photo, firebaseUid }) {
  const now = new Date();

  return {
    name: name || '',
    email,
    photo: photo || '',
    firebaseUid,
    role: 'customer',
    status: 'active',
    chefStatus: 'none',
    createdAt: now,
    lastLogin: now
  };
}

function buildLoginUpdate(existingUser, { name, photo }) {
  const update = {
    lastLogin: new Date()
  };

  if (name && name !== existingUser.name) {
    update.name = name;
  }

  if (photo && photo !== existingUser.photo) {
    update.photo = photo;
  }

  return update;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function buildAvailability(payload) {
  const workingDays = Array.isArray(payload.workingDays)
    ? [...new Set(payload.workingDays.map((day) => String(day).toLowerCase()).filter((day) => DAYS.includes(day)))]
    : [];
  const openingTime = String(payload.openingTime || '09:00');
  const closingTime = String(payload.closingTime || '21:00');
  const maximumDailyOrders = Number(payload.maximumDailyOrders);

  if (!TIME_PATTERN.test(openingTime) || !TIME_PATTERN.test(closingTime)) throw new Error('Opening and closing times must be valid');
  if (openingTime >= closingTime) throw new Error('Closing time must be later than opening time');
  if (!Number.isInteger(maximumDailyOrders) || maximumDailyOrders < 1 || maximumDailyOrders > 500) throw new Error('Maximum daily orders must be between 1 and 500');
  if (payload.acceptingOrders && !payload.vacationMode && !workingDays.length) throw new Error('Select at least one working day');

  return {
    acceptingOrders: Boolean(payload.acceptingOrders),
    workingDays,
    openingTime,
    closingTime,
    vacationMode: Boolean(payload.vacationMode),
    maximumDailyOrders,
    updatedAt: new Date()
  };
}

export async function saveFirebaseUser(req, res) {
  try {
    const { name, email, photo, firebaseUid } = req.body;

    if (!email || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Email and firebaseUid are required'
      });
    }

    const usersCollection = getUsersCollection();
    const existingUser = await usersCollection.findOne({ email });

    if (!existingUser) {
      await usersCollection.insertOne(buildUserDocument({ name, email, photo, firebaseUid }));
      await notifyAdmins({
        type: 'user',
        title: 'New user registered',
        message: `${name || email} joined HomeBite as a customer.`
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully'
      });
    }

    await usersCollection.updateOne(
      { email },
      {
        $set: buildLoginUpdate(existingUser, { name, photo })
      }
    );

    return res.status(200).json({
      success: true,
      message: 'User already exists. Login updated.'
    });
  } catch (error) {
    console.error('Save user failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to save user'
    });
  }
}

export async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await getUsersCollection().findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
}

export async function getUserRoleByEmail(req, res) {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await getUsersCollection().findOne({ email }, { projection: { role: 1 } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      role: user.role
    });
  } catch (error) {
    console.error('Get user role failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to get user role'
    });
  }
}

export async function updateChefAvailability(req, res) {
  try {
    const email = String(req.params.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Chef email is required' });

    const availability = buildAvailability(req.body);
    const result = await getUsersCollection().updateOne(
      { email, role: 'chef' },
      { $set: { availability } }
    );
    if (!result.matchedCount) return res.status(404).json({ success: false, message: 'Chef not found' });

    return res.status(200).json({ success: true, message: 'Availability updated successfully', data: availability });
  } catch (error) {
    const validationError = error.message.includes('must') || error.message.includes('later') || error.message.includes('Select');
    if (validationError) return res.status(400).json({ success: false, message: error.message });
    console.error('Update chef availability failed:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update availability' });
  }
}

export async function updateCustomerProfile(req, res) {
  try {
    const email = String(req.params.email || '').trim().toLowerCase();
    const name = String(req.body.name || '').trim();
    const photo = String(req.body.photo || '').trim();
    const phone = String(req.body.phone || '').trim();
    const address = String(req.body.address || '').trim();
    const city = String(req.body.city || '').trim();
    const country = String(req.body.country || '').trim();

    if (!email || name.length < 2) return res.status(400).json({ success: false, message: 'Email and a valid name are required' });
    if (photo && !/^https?:\/\//i.test(photo)) return res.status(400).json({ success: false, message: 'Profile photo must be a valid URL' });

    const result = await getUsersCollection().findOneAndUpdate(
      { email },
      { $set: { name, photo, phone, address, city, country, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    const updatedUser = result?.value || result;
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update customer profile failed:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}

const notificationPreferenceKeys = ['orderNotifications', 'newReviewNotifications', 'messages', 'promotions', 'systemUpdates'];

export async function updateCustomerNotificationPreferences(req, res) {
  try {
    const email = String(req.params.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Customer email is required' });

    const preferences = {};
    for (const key of notificationPreferenceKeys) {
      if (typeof req.body[key] !== 'boolean') return res.status(400).json({ success: false, message: `${key} must be true or false` });
      preferences[key] = req.body[key];
    }
    preferences.updatedAt = new Date();

    const result = await getUsersCollection().updateOne(
      { email, role: 'customer', status: { $ne: 'inactive' } },
      { $set: { notificationPreferences: preferences } }
    );
    if (!result.matchedCount) return res.status(404).json({ success: false, message: 'Active customer account not found' });
    return res.status(200).json({ success: true, message: 'Notification preferences updated successfully', data: preferences });
  } catch (error) {
    console.error('Update customer notification preferences failed:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to update notification preferences' });
  }
}

export async function deactivateCustomerAccount(req, res) {
  try {
    const email = String(req.params.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Customer email is required' });

    const customer = await getUsersCollection().findOne({ email, role: 'customer', status: { $ne: 'inactive' } });
    if (!customer) return res.status(404).json({ success: false, message: 'Active customer account not found' });

    const activeOrders = await getDB().collection('orders').countDocuments({
      'customer.email': email,
      status: { $nin: ['delivered', 'rejected', 'cancelled'] }
    });
    if (activeOrders > 0) return res.status(409).json({ success: false, message: 'You have active orders. Complete them before deleting your account.' });

    const deactivatedAt = new Date();
    await getUsersCollection().updateOne(
      { _id: customer._id },
      { $set: { status: 'inactive', deactivatedAt, updatedAt: deactivatedAt } }
    );
    return res.status(200).json({ success: true, message: 'Customer account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate customer account failed:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to deactivate customer account' });
  }
}

import { getDB } from '../config/db.js';

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
    chefVerified: 'none',
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

import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

function getChefApplicationsCollection() {
  return getDB().collection('chefApplications');
}

function getUsersCollection() {
  return getDB().collection('users');
}

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

function buildApplicationDocument(data, user) {
  const now = new Date();

  return {
    userId: user._id,
    firebaseUid: data.firebaseUid || user.firebaseUid || '',
    name: data.name || user.name || '',
    email: data.email,
    phone: data.phone || '',
    location: data.location || '',
    experience: data.experience || '',
    specialties: Array.isArray(data.specialties) ? data.specialties : [],
    bio: data.bio || '',
    documents: Array.isArray(data.documents) ? data.documents : [],
    status: 'pending',
    rejectionReason: '',
    submittedAt: now,
    reviewedAt: null,
    reviewedBy: null
  };
}

async function findApplicationById(id) {
  if (!isValidObjectId(id)) {
    return null;
  }

  return getChefApplicationsCollection().findOne({ _id: new ObjectId(id) });
}

export async function createChefApplication(req, res) {
  try {
    const { email } = req.body;

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

    const application = buildApplicationDocument(req.body, user);
    const result = await getChefApplicationsCollection().insertOne(application);

    await getUsersCollection().updateOne(
      { _id: user._id },
      {
        $set: {
          chefStatus: 'pending'
        }
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Chef application submitted successfully',
      applicationId: result.insertedId
    });
  } catch (error) {
    console.error('Create chef application failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to submit chef application'
    });
  }
}

export async function getChefApplications(req, res) {
  try {
    const applications = await getChefApplicationsCollection().find().sort({ submittedAt: -1 }).toArray();

    return res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get chef applications failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to get chef applications'
    });
  }
}

export async function getChefApplicationById(req, res) {
  try {
    const application = await findApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Chef application not found'
      });
    }

    return res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get chef application failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to get chef application'
    });
  }
}

export async function approveChefApplication(req, res) {
  try {
    const { reviewedBy } = req.body;
    const reviewedAt = new Date();
    const application = await findApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Chef application not found'
      });
    }

    await getChefApplicationsCollection().updateOne(
      { _id: application._id },
      {
        $set: {
          status: 'approved',
          reviewedAt,
          reviewedBy: reviewedBy || null,
          rejectionReason: ''
        }
      }
    );

    await getUsersCollection().updateOne(
      { _id: application.userId },
      {
        $set: {
          role: 'chef',
          chefStatus: 'approved'
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Chef application approved successfully'
    });
  } catch (error) {
    console.error('Approve chef application failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to approve chef application'
    });
  }
}

export async function rejectChefApplication(req, res) {
  try {
    const { reviewedBy, rejectionReason } = req.body;
    const reviewedAt = new Date();
    const application = await findApplicationById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Chef application not found'
      });
    }

    await getChefApplicationsCollection().updateOne(
      { _id: application._id },
      {
        $set: {
          status: 'rejected',
          reviewedAt,
          reviewedBy: reviewedBy || null,
          rejectionReason: rejectionReason || ''
        }
      }
    );

    await getUsersCollection().updateOne(
      { _id: application.userId },
      {
        $set: {
          role: 'customer',
          chefStatus: 'rejected'
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Chef application rejected successfully'
    });
  } catch (error) {
    console.error('Reject chef application failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to reject chef application'
    });
  }
}

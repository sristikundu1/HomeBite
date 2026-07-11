import { getDB } from '../config/db.js';
import { notifyAdmins, notifyRecipients } from '../services/notifications.service.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let newsletterIndexPromise;

function newsletter() {
  return getDB().collection('newsletter');
}

async function ensureNewsletterIndex() {
  if (!newsletterIndexPromise) {
    newsletterIndexPromise = newsletter().createIndex({ email: 1 }, { unique: true, name: 'unique_newsletter_email' })
      .catch((error) => {
        newsletterIndexPromise = null;
        throw error;
      });
  }
  return newsletterIndexPromise;
}

export async function subscribeNewsletter(req, res) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const receiverEmail = typeof req.body.receiverEmail === 'string' ? req.body.receiverEmail.trim().toLowerCase() : '';

    if (!email) return sendError(res, 400, 'Email is required');
    if (!EMAIL_PATTERN.test(email)) return sendError(res, 400, 'Please enter a valid email address');

    await ensureNewsletterIndex();
    if (await newsletter().findOne({ email })) return sendError(res, 409, 'Already subscribed');

    const subscription = {
      email,
      status: 'active',
      source: 'homepage',
      subscribedAt: new Date(),
      lastEmailSent: null
    };
    const result = await newsletter().insertOne(subscription);

    if (receiverEmail) {
      await notifyRecipients([receiverEmail], {
        type: 'newsletter',
        title: 'Newsletter Subscription Successful',
        message: 'You have successfully subscribed to the HomeBite Newsletter.'
      });
    }
    await notifyAdmins({
      type: 'newsletter',
      title: 'New Newsletter Subscriber',
      message: 'A new user subscribed to the newsletter.'
    });

    return sendSuccess(res, 201, 'Successfully subscribed', { ...subscription, _id: result.insertedId });
  } catch (error) {
    if (error?.code === 11000) return sendError(res, 409, 'Already subscribed');
    console.error('Newsletter subscription failed:', error.message);
    return sendError(res, 500, 'Failed to subscribe to newsletter');
  }
}

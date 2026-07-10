import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const SETTINGS_KEY = 'platform';
const defaults = {
  platformName: 'HomeBite', supportEmail: '', supportPhone: '', logo: '', favicon: '',
  maintenanceMode: false, defaultCurrency: 'BDT', defaultLanguage: 'en',
  socialLinks: { facebook: '', instagram: '', x: '', youtube: '' }
};
const settings = () => getDB().collection('platformSettings');
const text = (value, max) => String(value || '').trim().slice(0, max);
const url = (value) => { const result = text(value, 500); if (result && !/^https?:\/\//i.test(result)) throw new Error('Links must use http:// or https://'); return result; };

function payload(body) {
  const supportEmail = text(body.supportEmail, 200).toLowerCase();
  if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) throw new Error('A valid support email is required');
  const defaultCurrency = text(body.defaultCurrency, 3).toUpperCase();
  const defaultLanguage = text(body.defaultLanguage, 10).toLowerCase();
  if (!text(body.platformName, 100)) throw new Error('Platform name is required');
  if (!['BDT', 'USD', 'EUR', 'GBP'].includes(defaultCurrency)) throw new Error('A valid default currency is required');
  if (!['en', 'bn', 'it'].includes(defaultLanguage)) throw new Error('A valid default language is required');
  return {
    platformName: text(body.platformName, 100), supportEmail, supportPhone: text(body.supportPhone, 50),
    logo: url(body.logo), favicon: url(body.favicon), maintenanceMode: Boolean(body.maintenanceMode), defaultCurrency, defaultLanguage,
    socialLinks: { facebook: url(body.socialLinks?.facebook), instagram: url(body.socialLinks?.instagram), x: url(body.socialLinks?.x), youtube: url(body.socialLinks?.youtube) }
  };
}

export async function getPlatformSettings(req, res) {
  try {
    const stored = await settings().findOne({ key: SETTINGS_KEY });
    return sendSuccess(res, 200, 'Platform settings retrieved successfully', { ...defaults, ...(stored || {}), socialLinks: { ...defaults.socialLinks, ...(stored?.socialLinks || {}) } });
  } catch (error) { console.error('Get platform settings failed:', error.message); return sendError(res, 500, 'Failed to get platform settings'); }
}

export async function updatePlatformSettings(req, res) {
  try {
    const update = { ...payload(req.body), updatedAt: new Date() };
    await settings().updateOne({ key: SETTINGS_KEY }, { $set: update, $setOnInsert: { key: SETTINGS_KEY, createdAt: new Date() } }, { upsert: true });
    return sendSuccess(res, 200, 'Platform settings saved successfully', await settings().findOne({ key: SETTINGS_KEY }));
  } catch (error) {
    if (/required|valid|must/i.test(error.message)) return sendError(res, 400, error.message);
    console.error('Update platform settings failed:', error.message); return sendError(res, 500, 'Failed to update platform settings');
  }
}

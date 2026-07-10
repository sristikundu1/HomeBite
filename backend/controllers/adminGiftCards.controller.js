import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const giftCards = () => getDB().collection('giftCards');
const giftCardId = (value) => ObjectId.isValid(value) ? new ObjectId(value) : null;
let indexPromise;

async function ensureCodeIndex() {
  if (!indexPromise) indexPromise = giftCards().createIndex({ code: 1 }, { unique: true, name: 'unique_gift_card_code' }).catch((error) => { indexPromise = null; throw error; });
  return indexPromise;
}

function payload(body) {
  const code = String(body.code || '').trim().toUpperCase();
  const value = Number(body.value);
  const expiryDate = new Date(body.expiryDate);
  const status = String(body.status || 'active').trim().toLowerCase();
  if (!code || code.length > 50) throw new Error('Gift card code is required and must not exceed 50 characters');
  if (!Number.isFinite(value) || value <= 0) throw new Error('Gift card value must be greater than 0');
  if (Number.isNaN(expiryDate.getTime())) throw new Error('A valid expiry date is required');
  if (!['active', 'inactive'].includes(status)) throw new Error('Status must be active or inactive');
  return { code, value: Math.round(value * 100) / 100, expiryDate, status };
}

function fail(res, error, action) {
  if (error?.code === 11000) return sendError(res, 409, 'Gift card code already exists');
  if (/required|must|valid|greater/i.test(error.message)) return sendError(res, 400, error.message);
  console.error(`${action} gift card failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()} gift card`);
}

export async function getGiftCards(req, res) {
  try { return sendSuccess(res, 200, 'Gift cards retrieved successfully', await giftCards().find().sort({ createdAt: -1, _id: -1 }).toArray()); }
  catch (error) { return fail(res, error, 'Get'); }
}

export async function createGiftCard(req, res) {
  try {
    await ensureCodeIndex();
    const now = new Date();
    const giftCard = { ...payload(req.body), createdAt: now, updatedAt: now };
    const result = await giftCards().insertOne(giftCard);
    return sendSuccess(res, 201, 'Gift card created successfully', { ...giftCard, _id: result.insertedId });
  } catch (error) { return fail(res, error, 'Create'); }
}

export async function deactivateGiftCard(req, res) {
  try {
    const _id = giftCardId(req.params.id);
    if (!_id) return sendError(res, 400, 'Valid gift card id is required');
    const result = await giftCards().updateOne({ _id }, { $set: { status: 'inactive', updatedAt: new Date() } });
    if (!result.matchedCount) return sendError(res, 404, 'Gift card not found');
    return sendSuccess(res, 200, 'Gift card deactivated successfully', await giftCards().findOne({ _id }));
  } catch (error) { return fail(res, error, 'Deactivate'); }
}

export async function deleteGiftCard(req, res) {
  try {
    const _id = giftCardId(req.params.id);
    if (!_id) return sendError(res, 400, 'Valid gift card id is required');
    const result = await giftCards().deleteOne({ _id });
    if (!result.deletedCount) return sendError(res, 404, 'Gift card not found');
    return sendSuccess(res, 200, 'Gift card deleted successfully', { _id });
  } catch (error) { return fail(res, error, 'Delete'); }
}

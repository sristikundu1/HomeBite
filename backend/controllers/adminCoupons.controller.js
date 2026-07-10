import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const coupons = () => getDB().collection('coupons');
const couponId = (value) => ObjectId.isValid(value) ? new ObjectId(value) : null;
const number = (value) => Number(value || 0);
let indexPromise;

async function ensureCouponIndex() {
  if (!indexPromise) indexPromise = coupons().createIndex({ code: 1 }, { unique: true, name: 'unique_coupon_code' }).catch((error) => { indexPromise = null; throw error; });
  return indexPromise;
}

function couponPayload(body) {
  const code = String(body.code || '').trim().toUpperCase();
  const description = String(body.description || '').trim();
  const discountType = String(body.discountType || '').trim().toLowerCase();
  const percentage = number(body.percentage);
  const fixedAmount = number(body.fixedAmount);
  const minimumOrder = number(body.minimumOrder);
  const maximumDiscount = number(body.maximumDiscount);
  const expiryDate = new Date(body.expiryDate);
  const status = String(body.status || 'active').trim().toLowerCase();

  if (!code || code.length > 40) throw new Error('Coupon code is required and must not exceed 40 characters');
  if (!description || description.length > 300) throw new Error('Description is required and must not exceed 300 characters');
  if (!['percentage', 'fixed'].includes(discountType)) throw new Error('Discount type must be percentage or fixed');
  if (discountType === 'percentage' && (percentage <= 0 || percentage > 100)) throw new Error('Percentage must be between 1 and 100');
  if (discountType === 'fixed' && fixedAmount <= 0) throw new Error('Fixed amount must be greater than 0');
  if (minimumOrder < 0 || maximumDiscount < 0) throw new Error('Order and discount limits cannot be negative');
  if (Number.isNaN(expiryDate.getTime())) throw new Error('A valid expiry date is required');
  if (!['active', 'inactive'].includes(status)) throw new Error('Status must be active or inactive');

  return { code, description, discountType, percentage: discountType === 'percentage' ? percentage : 0, fixedAmount: discountType === 'fixed' ? fixedAmount : 0, minimumOrder, maximumDiscount, expiryDate, status };
}

function handleError(res, error, action) {
  if (error?.code === 11000) return sendError(res, 409, 'Coupon code already exists');
  if (/required|must|cannot|valid|between|greater/i.test(error.message)) return sendError(res, 400, error.message);
  console.error(`${action} coupon failed:`, error.message);
  return sendError(res, 500, `Failed to ${action.toLowerCase()} coupon`);
}

export async function getCoupons(req, res) {
  try {
    const data = await coupons().find().sort({ createdAt: -1, _id: -1 }).toArray();
    return sendSuccess(res, 200, 'Coupons retrieved successfully', data);
  } catch (error) { return handleError(res, error, 'Get'); }
}

export async function createCoupon(req, res) {
  try {
    await ensureCouponIndex();
    const now = new Date();
    const coupon = { ...couponPayload(req.body), createdAt: now, updatedAt: now };
    const result = await coupons().insertOne(coupon);
    return sendSuccess(res, 201, 'Coupon created successfully', { ...coupon, _id: result.insertedId });
  } catch (error) { return handleError(res, error, 'Create'); }
}

export async function updateCoupon(req, res) {
  try {
    await ensureCouponIndex();
    const _id = couponId(req.params.id);
    if (!_id) return sendError(res, 400, 'Valid coupon id is required');
    const update = { ...couponPayload(req.body), updatedAt: new Date() };
    const result = await coupons().updateOne({ _id }, { $set: update });
    if (!result.matchedCount) return sendError(res, 404, 'Coupon not found');
    return sendSuccess(res, 200, 'Coupon updated successfully', await coupons().findOne({ _id }));
  } catch (error) { return handleError(res, error, 'Update'); }
}

export async function updateCouponStatus(req, res) {
  try {
    const _id = couponId(req.params.id);
    const status = String(req.body.status || '').trim().toLowerCase();
    if (!_id || !['active', 'inactive'].includes(status)) return sendError(res, 400, 'Valid coupon id and status are required');
    const result = await coupons().updateOne({ _id }, { $set: { status, updatedAt: new Date() } });
    if (!result.matchedCount) return sendError(res, 404, 'Coupon not found');
    return sendSuccess(res, 200, `Coupon ${status === 'active' ? 'activated' : 'deactivated'} successfully`, await coupons().findOne({ _id }));
  } catch (error) { return handleError(res, error, 'Update'); }
}

export async function deleteCoupon(req, res) {
  try {
    const _id = couponId(req.params.id);
    if (!_id) return sendError(res, 400, 'Valid coupon id is required');
    const result = await coupons().deleteOne({ _id });
    if (!result.deletedCount) return sendError(res, 404, 'Coupon not found');
    return sendSuccess(res, 200, 'Coupon deleted successfully', { _id });
  } catch (error) { return handleError(res, error, 'Delete'); }
}

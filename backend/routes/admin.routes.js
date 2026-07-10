import express from 'express';
import { getAdminOverview } from '../controllers/adminOverview.controller.js';
import { getManagedFoods } from '../controllers/adminFoods.controller.js';
import { activateManagedUser, getManagedUsers, softDeleteManagedUser, suspendManagedUser, updateManagedUserRole } from '../controllers/adminUsers.controller.js';
import { createCoupon, deleteCoupon, getCoupons, updateCoupon, updateCouponStatus } from '../controllers/adminCoupons.controller.js';
import { createGiftCard, deactivateGiftCard, deleteGiftCard, getGiftCards } from '../controllers/adminGiftCards.controller.js';

const router = express.Router();
router.get('/overview', getAdminOverview);
router.get('/users', getManagedUsers);
router.get('/foods', getManagedFoods);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.patch('/coupons/:id/status', updateCouponStatus);
router.delete('/coupons/:id', deleteCoupon);
router.get('/gift-cards', getGiftCards);
router.post('/gift-cards', createGiftCard);
router.patch('/gift-cards/:id/deactivate', deactivateGiftCard);
router.delete('/gift-cards/:id', deleteGiftCard);
router.patch('/users/:id/role', updateManagedUserRole);
router.patch('/users/:id/suspend', suspendManagedUser);
router.patch('/users/:id/activate', activateManagedUser);
router.delete('/users/:id', softDeleteManagedUser);

export default router;

import express from 'express';
import { getAdminOverview } from '../controllers/adminOverview.controller.js';
import { getManagedFoods } from '../controllers/adminFoods.controller.js';
import { activateManagedUser, getManagedUsers, softDeleteManagedUser, suspendManagedUser, updateManagedUserRole } from '../controllers/adminUsers.controller.js';

const router = express.Router();
router.get('/overview', getAdminOverview);
router.get('/users', getManagedUsers);
router.get('/foods', getManagedFoods);
router.patch('/users/:id/role', updateManagedUserRole);
router.patch('/users/:id/suspend', suspendManagedUser);
router.patch('/users/:id/activate', activateManagedUser);
router.delete('/users/:id', softDeleteManagedUser);

export default router;

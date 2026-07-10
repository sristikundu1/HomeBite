import express from 'express';
import { deactivateCustomerAccount, getUserByEmail, getUserRoleByEmail, saveFirebaseUser, updateChefAvailability, updateCustomerNotificationPreferences, updateCustomerProfile } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/', saveFirebaseUser);
router.get('/role/:email', getUserRoleByEmail);
router.patch('/:email/availability', updateChefAvailability);
router.patch('/:email/profile', updateCustomerProfile);
router.patch('/:email/preferences', updateCustomerNotificationPreferences);
router.patch('/:email/deactivate', deactivateCustomerAccount);
router.get('/:email', getUserByEmail);

export default router;

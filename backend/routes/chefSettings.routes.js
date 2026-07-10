import express from 'express';
import { deactivateChef, updateChefNotificationPreferences } from '../controllers/chefSettings.controller.js';

const router = express.Router();
router.patch('/deactivate', deactivateChef);
router.patch('/settings/:email/preferences', updateChefNotificationPreferences);

export default router;

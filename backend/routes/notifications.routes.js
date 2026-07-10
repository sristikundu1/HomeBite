import express from 'express';
import {
  createNotification,
  deleteNotification,
  getNotifications,
  markNotificationAsRead
} from '../controllers/notifications.controller.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/:email', getNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

export default router;


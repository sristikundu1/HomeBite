import express from 'express';
import {
  approveChefApplication,
  createChefApplication,
  getChefApplicationById,
  getChefApplications,
  rejectChefApplication
} from '../controllers/chefApplications.controller.js';

const router = express.Router();

router.post('/', createChefApplication);
router.get('/', getChefApplications);
router.get('/:id', getChefApplicationById);
router.patch('/:id/approve', approveChefApplication);
router.patch('/:id/reject', rejectChefApplication);

export default router;

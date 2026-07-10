import express from 'express';
import { getChefProfile, updateChefProfile } from '../controllers/chefProfile.controller.js';

const router = express.Router();
router.get('/:email', getChefProfile);
router.patch('/:id', updateChefProfile);

export default router;

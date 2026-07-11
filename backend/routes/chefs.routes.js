import express from 'express';
import { getChefById, getChefs, getFeaturedChefs } from '../controllers/chefs.controller.js';

const router = express.Router();
router.get('/featured', getFeaturedChefs);
router.get('/', getChefs);
router.get('/:id', getChefById);

export default router;

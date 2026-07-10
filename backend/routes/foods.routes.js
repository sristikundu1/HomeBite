import express from 'express';
import {
  createFood,
  getFoodCategories,
  getFoodById,
  getFoods,
  getFoodsByChef,
  softDeleteFood,
  toggleFoodArchive,
  toggleFoodAvailability,
  updateFood
} from '../controllers/foods.controller.js';

const router = express.Router();

router.post('/', createFood);
router.get('/', getFoods);
router.get('/categories', getFoodCategories);
router.get('/chef/:email', getFoodsByChef);
router.get('/:id', getFoodById);
router.put('/:id', updateFood);
router.patch('/:id/availability', toggleFoodAvailability);
router.patch('/:id/archive', toggleFoodArchive);
router.delete('/:id', softDeleteFood);

export default router;

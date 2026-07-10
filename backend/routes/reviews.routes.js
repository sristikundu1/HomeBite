import express from 'express';
import { createReview, getChefReviews, getFoodReviews, getOrderReview } from '../controllers/reviews.controller.js';

const router = express.Router();

router.post('/', createReview);
router.get('/food/:foodId', getFoodReviews);
router.get('/chef/:email', getChefReviews);
router.get('/order/:orderId', getOrderReview);

export default router;

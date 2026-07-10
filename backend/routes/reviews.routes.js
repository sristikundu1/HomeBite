import express from 'express';
import { createReview, deleteReview, getChefReviews, getCustomerReviews, getFoodReviews, getOrderReview, updateReview } from '../controllers/reviews.controller.js';

const router = express.Router();

router.post('/', createReview);
router.get('/food/:foodId', getFoodReviews);
router.get('/chef/:email', getChefReviews);
router.get('/customer/:email', getCustomerReviews);
router.get('/order/:orderId', getOrderReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

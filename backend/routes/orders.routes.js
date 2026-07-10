import express from 'express';
import {
  createOrder,
  getChefOrders,
  getCustomerOrders,
  getOrders,
  updateOrderStatus
} from '../controllers/orders.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/customer/:email', getCustomerOrders);
router.get('/chef/:email', getChefOrders);
router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;

import express from 'express';
import {
  createOrder,
  getChefOrders,
  getCustomerOrders,
  getOrderById,
  getOrders,
  updateOrderStatus
} from '../controllers/orders.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/customer/:email', getCustomerOrders);
router.get('/chef/:email', getChefOrders);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;

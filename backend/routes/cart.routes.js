import express from 'express';
import {
  addCartItem,
  clearUserCart,
  getCartByUser,
  removeCartItem,
  updateCartItemQuantity
} from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/', addCartItem);
router.get('/:email', getCartByUser);
router.patch('/:id', updateCartItemQuantity);
router.delete('/user/:email', clearUserCart);
router.delete('/:id', removeCartItem);

export default router;


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function createPaymentIntent(totalAmount) {
  return api.post('/create-payment-intent', { totalAmount });
}

export function createOrder(order) {
  return api.post('/orders', order);
}


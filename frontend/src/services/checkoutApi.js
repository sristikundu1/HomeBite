import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/'
});

export function createPaymentIntent(totalAmount) {
  return api.post('/create-payment-intent', { totalAmount });
}

export function createOrder(order) {
  return api.post('/orders', order);
}


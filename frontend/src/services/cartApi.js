import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/'
});

export function addCartItem(item) {
  return api.post('/cart', item);
}

export function getUserCart(email) {
  return api.get(`/cart/${encodeURIComponent(email)}`);
}

export function updateCartItemQuantity(id, quantity) {
  return api.patch(`/cart/${id}`, { quantity });
}

export function removeCartItem(id) {
  return api.delete(`/cart/${id}`);
}

export function clearUserCart(email) {
  return api.delete(`/cart/user/${encodeURIComponent(email)}`);
}


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function getOrder(id) {
  return api.get(`/orders/${id}`);
}

export function getChefOrders(email) {
  return api.get(`/orders/chef/${encodeURIComponent(email)}`);
}

export function getCustomerOrders(email) {
  return api.get(`/orders/customer/${encodeURIComponent(email)}`);
}

export function updateOrderStatus(id, status) {
  return api.patch(`/orders/${id}/status`, { status });
}

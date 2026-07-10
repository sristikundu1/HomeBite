import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });

export function getAdminOverview() {
  return api.get('/admin/overview');
}

export function getManagedUsers() {
  return api.get('/admin/users');
}

export function getManagedFoods() {
  return api.get('/admin/foods');
}

export function updateManagedUserRole(id, role) {
  return api.patch(`/admin/users/${id}/role`, { role });
}

export function suspendManagedUser(id) {
  return api.patch(`/admin/users/${id}/suspend`);
}

export function activateManagedUser(id) {
  return api.patch(`/admin/users/${id}/activate`);
}

export function softDeleteManagedUser(id) {
  return api.delete(`/admin/users/${id}`);
}

export const getCoupons = () => api.get('/admin/coupons');
export const createCoupon = (coupon) => api.post('/admin/coupons', coupon);
export const updateCoupon = (id, coupon) => api.put(`/admin/coupons/${id}`, coupon);
export const updateCouponStatus = (id, status) => api.patch(`/admin/coupons/${id}/status`, { status });
export const deleteCoupon = (id) => api.delete(`/admin/coupons/${id}`);

export const getGiftCards = () => api.get('/admin/gift-cards');
export const createGiftCard = (giftCard) => api.post('/admin/gift-cards', giftCard);
export const deactivateGiftCard = (id) => api.patch(`/admin/gift-cards/${id}/deactivate`);
export const deleteGiftCard = (id) => api.delete(`/admin/gift-cards/${id}`);

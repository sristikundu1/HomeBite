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

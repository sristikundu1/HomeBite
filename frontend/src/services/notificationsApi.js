import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/'
});

export function getUserNotifications(email) {
  return api.get(`/notifications/${encodeURIComponent(email)}`);
}

export function markNotificationRead(id, email) {
  return api.patch(`/notifications/${id}/read`, null, { params: { email } });
}

export function removeNotification(id, email) {
  return api.delete(`/notifications/${id}`, { params: { email } });
}


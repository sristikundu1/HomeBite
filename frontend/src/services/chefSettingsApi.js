import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/' });

export function saveChefNotificationPreferences(email, preferences) {
  return api.patch(`/chef/settings/${encodeURIComponent(email)}/preferences`, preferences);
}

export function deactivateChef(email) {
  return api.patch('/chef/deactivate', { email });
}

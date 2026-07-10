import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });

export function saveChefNotificationPreferences(email, preferences) {
  return api.patch(`/chef/settings/${encodeURIComponent(email)}/preferences`, preferences);
}

export function deactivateChef(email) {
  return api.patch('/chef/deactivate', { email });
}

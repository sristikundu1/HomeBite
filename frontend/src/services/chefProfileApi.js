import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });

export function getChefProfile(email) {
  return api.get(`/chef/profile/${encodeURIComponent(email)}`);
}

export function updateChefProfile(id, profile) {
  return api.patch(`/chef/profile/${id}`, profile);
}

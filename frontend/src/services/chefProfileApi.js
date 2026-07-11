import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/' });

export function getChefProfile(email) {
  return api.get(`/chef/profile/${encodeURIComponent(email)}`);
}

export function updateChefProfile(id, profile) {
  return api.patch(`/chef/profile/${id}`, profile);
}

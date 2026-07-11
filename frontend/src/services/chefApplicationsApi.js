import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/'
});

export function submitChefApplication(application) {
  return api.post('/chef-applications', application);
}

export function getChefApplications() {
  return api.get('/chef-applications');
}

export function approveChefApplication(id, payload) {
  return api.patch(`/chef-applications/${id}/approve`, payload);
}

export function rejectChefApplication(id, payload) {
  return api.patch(`/chef-applications/${id}/reject`, payload);
}

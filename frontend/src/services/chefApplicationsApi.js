import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
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

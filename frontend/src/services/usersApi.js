import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function saveUser(user) {
  return api.post('/users', {
    name: user?.displayName || '',
    email: user?.email || '',
    photo: user?.photoURL || '',
    firebaseUid: user?.uid || ''
  });
}

export function getUserByEmail(email) {
  return api.get(`/users/${encodeURIComponent(email)}`);
}

export function getUserRoleByEmail(email) {
  return api.get(`/users/role/${encodeURIComponent(email)}`);
}

export function updateChefAvailability(email, availability) {
  return api.patch(`/users/${encodeURIComponent(email)}/availability`, availability);
}

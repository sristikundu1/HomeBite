import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function createFood(food) {
  return api.post('/foods', food);
}

export function getFoods() {
  return api.get('/foods');
}

export function getFoodCategories() {
  return api.get('/foods/categories');
}

export function getFeaturedFoods() {
  return api.get('/foods/featured');
}

export function getChefFoods(email) {
  return api.get(`/foods/chef/${encodeURIComponent(email)}`);
}

export function getFood(id) {
  return api.get(`/foods/${id}`);
}

export function updateFood(id, food) {
  return api.put(`/foods/${id}`, food);
}

export function toggleFoodAvailability(id) {
  return api.patch(`/foods/${id}/availability`);
}

export function toggleFoodArchive(id) {
  return api.patch(`/foods/${id}/archive`);
}

export function deleteFood(id) {
  return api.delete(`/foods/${id}`);
}

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export function submitReview(review) {
  return api.post('/reviews', review);
}

export function getFoodReviews(foodId) {
  return api.get(`/reviews/food/${foodId}`);
}

export function getOrderReview(orderId) {
  return api.get(`/reviews/order/${orderId}`);
}

export function getChefReviews(email) {
  return api.get(`/reviews/chef/${encodeURIComponent(email)}`);
}

export function getCustomerReviews(email) {
  return api.get(`/reviews/customer/${encodeURIComponent(email)}`);
}

export function updateReview(id, review) {
  return api.patch(`/reviews/${id}`, review);
}

export function deleteReview(id, email) {
  return api.delete(`/reviews/${id}`, { params: { email } });
}

import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/' });

export const getFeaturedChefs = () => api.get('/chefs/featured');
export const getChefs = (params = {}) => api.get('/chefs', { params });
export const getChef = (id) => api.get(`/chefs/${id}`);

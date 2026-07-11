import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/' });

export const subscribeToNewsletter = (email, receiverEmail = '') => api.post('/newsletter', { email, receiverEmail });

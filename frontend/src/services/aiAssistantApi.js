import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/' });

export function askFoodAssistant(message, history, currentPath) {
  return api.post('/ai-assistant/chat', { message, history, currentPath });
}

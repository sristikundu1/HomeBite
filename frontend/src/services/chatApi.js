import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://backend-kappa-woad-55.vercel.app/' });

export const getChatContacts = (email) => api.get(`/chat/contacts/${encodeURIComponent(email)}`);
export const getConversations = (email) => api.get(`/chat/conversations/${encodeURIComponent(email)}`);
export const createConversation = (userEmail, participantEmail) => api.post('/chat/conversations', { userEmail, participantEmail });
export const getConversationMessages = (id, email) => api.get(`/chat/conversations/${id}/messages`, { params: { email } });
export const sendChatMessage = (id, senderEmail, text) => api.post(`/chat/conversations/${id}/messages`, { senderEmail, text });
export const markChatRead = (id, email) => api.patch(`/chat/conversations/${id}/read`, { email });

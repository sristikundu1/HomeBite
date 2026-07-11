import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });

export function getBlogs(params) {
  return api.get('/blogs', { params });
}

export function getBlogBySlug(slug) {
  return api.get(`/blogs/${encodeURIComponent(slug)}`);
}

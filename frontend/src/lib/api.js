import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://gatherly-event-managemnet.onrender.com' : ''),
});

export default api;
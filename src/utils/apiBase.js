const API_BASE = (typeof window !== 'undefined' && window.API_BASE)
  ? window.API_BASE
  : (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api');

export default API_BASE;

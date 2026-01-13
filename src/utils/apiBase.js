// API Base URL configuration
// Resolves in this order:
// 1. VITE_API_BASE environment variable (if set and not empty)
// 2. Production backend fallback (used on Vercel)
const API_BASE = (import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.trim()) 
  ? import.meta.env.VITE_API_BASE 
  : 'https://backend-xfp1.vercel.app/api';

// Backward compatibility: export base without /api suffix for image URLs
export const API_BASE_URL = API_BASE.replace('/api', '');

export default API_BASE;

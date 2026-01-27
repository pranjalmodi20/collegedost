// src/services/axios.js

import axios from 'axios';

// =======================
// BACKEND URL RESOLVER
// =======================
const getCurrentBackendUrl = () => {
  const hostname = window.location.hostname;

  // 1. Strict Localhost Check: Only use localhost if the BROWSER itself is localhost
  // This invalidates bad Env Vars on deployed sites.
  // FORCE REBUILD: Updated Strict Logic
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check if Env Var exists and is valid, otherwise default to 5001
      return import.meta.env.VITE_API_BASE_URL 
          ? `${import.meta.env.VITE_API_BASE_URL}/api`
          : 'http://localhost:5001/api';
  }

  // 2. Production Fallback (Vercel/Render)
  // If we are NOT on localhost, we MUST use the public backend.
  // We ignore VITE_API_BASE_URL here if it points to localhost (common misconfig).
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost') && envUrl.startsWith('http')) {
       return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // 3. Absolute Fallback: If all else fails, use the hardcoded production URL.
  // This guarantees that a Vercel deployment NEVER tries to hit localhost.
  return 'https://collegedost-929n.onrender.com/api';
};

// =======================
// AXIOS INSTANCE
// =======================
const api = axios.create({
  baseURL: getCurrentBackendUrl()
});

// Debug log
console.log('API Base URL:', getCurrentBackendUrl());

// Google login env check
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.error(
    'Missing VITE_GOOGLE_CLIENT_ID in Environment Variables! Google Login will fail.'
  );
}

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: logout or redirect
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// src/lib/httpClient.ts
import axios from 'axios';
import { AUTH_STORAGE_KEYS } from '@/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar token de autenticação
httpClient.interceptors.request.use(
  (config) => {
    // Adicionar token se disponível
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lidar com erro de autenticação
    if (error.response?.status === 401) {
      // Limpar dados de autenticação se token expirado
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        
        // Redirecionar para login se não estiver na página de login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
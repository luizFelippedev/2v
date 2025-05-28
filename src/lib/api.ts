// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Criar instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Interceptor de requisição (adicionar token de autenticação)
api.interceptors.request.use(
  (config) => {
    // Tentar pegar token do localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("portfolio_token");
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

// Interceptor de resposta (tratar erros globais)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Se token expirou ou não autorizado
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("portfolio_token");
        // Redirecionar para login se não estiver na página de login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    
    // Log de erros em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// Função helper para fazer requisições
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Erro desconhecido";
    throw new Error(message);
  }
}

// Health check da API
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get("/health");
    return response.status === 200;
  } catch {
    return false;
  }
}

export default api;
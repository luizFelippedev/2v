// src/services/auth.service.ts
import { api, apiRequest } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
    token: string;
  };
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>({
      method: "POST",
      url: "/api/auth/login",
      data: credentials,
    });

    // Salvar token no localStorage se login for bem-sucedido
    if (response.success && response.data.token) {
      localStorage.setItem("portfolio_token", response.data.token);
    }

    return response;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiRequest({
        method: "POST",
        url: "/api/auth/logout",
      });
    } finally {
      // Sempre limpar token local, mesmo se a requisição falhar
      localStorage.removeItem("portfolio_token");
    }
  },

  // Verificar token atual
  async verifyToken(): Promise<{ success: boolean; data: { user: User } }> {
    return apiRequest({
      method: "GET",
      url: "/api/auth/verify",
    });
  },

  // Registrar novo usuário (se necessário)
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>({
      method: "POST",
      url: "/api/auth/register",
      data: userData,
    });
  },

  // Esqueci minha senha
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return apiRequest({
      method: "POST",
      url: "/api/auth/forgot-password",
      data: { email },
    });
  },

  // Resetar senha
  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    return apiRequest({
      method: "POST",
      url: "/api/auth/reset-password",
      data: { token, password },
    });
  },

  // Verificar se usuário está autenticado (sem fazer requisição)
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("portfolio_token");
  },

  // Pegar token atual
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("portfolio_token");
  },
};
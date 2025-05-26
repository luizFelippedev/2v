import { api } from './api';
import { ApiResponse, User } from '@/types/globals';
import Cookies from 'js-cookie';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.success) {
      // Salvar token no cookie e localStorage
      Cookies.set('auth_token', response.data.data.token, { expires: 7 });
      localStorage.setItem('portfolio_token', response.data.data.token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    // Limpar token do cookie e localStorage
    Cookies.remove('auth_token');
    localStorage.removeItem('portfolio_token');
    await api.post('/api/auth/logout');
  },

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    return api.get('/api/auth/verify');
  }
};

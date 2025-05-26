import { api } from './api';
import { ApiResponse, Analytics } from '@/types/globals';

interface User {
  id: string;
  email: string;
  name: string;
  // ...outros campos do usuário
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token?: string;
  };
}

const validateAuthResponse = (response: any): response is AuthResponse => {
  return (
    response?.success === true &&
    response?.data?.user &&
    (response?.data?.token === undefined || typeof response?.data?.token === 'string')
  );
};

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const analyticsService = {
  async track(event: string, data?: any): Promise<void> {
    return api.post('/api/public/analytics/track', {
      event,
      data,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
    });
  },
  
  async checkAuthEndpoints(): Promise<boolean> {
    try {
      const loginResponse = await api.post<AuthResponse>('/api/auth/login', {
        email: 'test@example.com',
        password: 'test123'
      });
      
      const verifyResponse = await api.get<AuthResponse>('/api/auth/verify');
      
      const isLoginValid = validateAuthResponse(loginResponse.data);
      const isVerifyValid = validateAuthResponse(verifyResponse.data);
      
      console.log('Login response format:', isLoginValid ? 'Valid ✅' : 'Invalid ❌');
      console.log('Verify response format:', isVerifyValid ? 'Valid ✅' : 'Invalid ❌');
      
      return isLoginValid && isVerifyValid;
    } catch (error) {
      console.error('Error checking auth endpoints:', error);
      return false;
    }
  }
};

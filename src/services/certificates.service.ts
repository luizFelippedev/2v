import { api } from './api';
import { ApiResponse, Certificate } from '@/types/globals';

export const certificatesService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    // ...existing params...
  }): Promise<ApiResponse<Certificate[]>> {
    return api.get('/api/public/certificates', { params });
  },
  
  // ...existing certificate methods...
};

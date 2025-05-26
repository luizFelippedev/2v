import { api } from './api';
import { ApiResponse, Project } from '@/types/globals';

export const projectsService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    // ...existing params...
  }): Promise<ApiResponse<Project[]>> {
    return api.get('/api/public/projects', { params });
  },
  
  // ...existing project methods...
};

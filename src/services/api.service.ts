// src/services/api.service.ts
import httpClient from '@/lib/httpClient';
import { User, AuthResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export class ApiService {
  // Autenticação
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  }

  static async logout(): Promise<void> {
    await httpClient.post('/api/auth/logout');
  }

  static async verifyToken(): Promise<AuthResponse> {
    const response = await httpClient.get<AuthResponse>('/api/auth/verify');
    return response.data;
  }

  // Projetos
  static async getProjects(params?: any) {
    const response = await httpClient.get('/api/public/projects', { params });
    return response.data;
  }

  static async getProjectBySlug(slug: string) {
    const response = await httpClient.get(`/api/public/projects/${slug}`);
    return response.data;
  }

  static async getFeaturedProjects() {
    const response = await httpClient.get('/api/public/projects', { 
      params: { featured: true, limit: 6 } 
    });
    return response.data;
  }

  // Certificados
  static async getCertificates(params?: any) {
    const response = await httpClient.get('/api/public/certificates', { params });
    return response.data;
  }

  // Configuração do site
  static async getConfiguration() {
    const response = await httpClient.get('/api/public/configuration');
    return response.data;
  }

  // Estatísticas
  static async getStats() {
    const response = await httpClient.get('/api/public/stats');
    return response.data;
  }

  // Admin: Dashboard
  static async getDashboardData() {
    const response = await httpClient.get('/api/admin/dashboard');
    return response.data;
  }

  // Admin: Projetos
  static async getAdminProjects(params?: any) {
    const response = await httpClient.get('/api/admin/projects', { params });
    return response.data;
  }

  static async getProjectById(id: string) {
    const response = await httpClient.get(`/api/admin/projects/${id}`);
    return response.data;
  }

  static async createProject(projectData: FormData) {
    const response = await httpClient.post('/api/admin/projects', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async updateProject(id: string, projectData: FormData) {
    const response = await httpClient.put(`/api/admin/projects/${id}`, projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async deleteProject(id: string) {
    const response = await httpClient.delete(`/api/admin/projects/${id}`);
    return response.data;
  }

  static async toggleProjectFeatured(id: string) {
    const response = await httpClient.patch(`/api/admin/projects/${id}/featured`);
    return response.data;
  }

  // Admin: Certificados
  static async getAdminCertificates(params?: any) {
    const response = await httpClient.get('/api/admin/certificates', { params });
    return response.data;
  }

  static async getCertificateById(id: string) {
    const response = await httpClient.get(`/api/admin/certificates/${id}`);
    return response.data;
  }

  static async createCertificate(certificateData: FormData) {
    const response = await httpClient.post('/api/admin/certificates', certificateData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async updateCertificate(id: string, certificateData: FormData) {
    const response = await httpClient.put(`/api/admin/certificates/${id}`, certificateData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async deleteCertificate(id: string) {
    const response = await httpClient.delete(`/api/admin/certificates/${id}`);
    return response.data;
  }

  static async toggleCertificateFeatured(id: string) {
    const response = await httpClient.patch(`/api/admin/certificates/${id}/featured`);
    return response.data;
  }

  // Admin: Configuração
  static async getAdminConfiguration() {
    const response = await httpClient.get('/api/admin/configuration');
    return response.data;
  }

  static async updateConfiguration(configData: FormData) {
    const response = await httpClient.put('/api/admin/configuration', configData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}
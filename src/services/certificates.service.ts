// src/services/certificates.service.ts
import { apiRequest } from "@/lib/api";

export interface Certificate {
  id: string;
  title: string;
  issuer: {
    name: string;
    logo?: string;
    website?: string;
  };
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  image: string;
  description: string;
  skills: string[];
  level: "foundational" | "associate" | "professional" | "expert" | "master";
  type: "technical" | "business" | "language" | "academic" | "professional";
  featured: boolean;
  verified: boolean;
  courseHours?: number;
  examScore?: number;
  passingScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificatesResponse {
  success: boolean;
  data: Certificate[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const certificatesService = {
  // === ROTAS PÚBLICAS ===

  // Buscar todos os certificados (público)
  async getAll(params?: {
    page?: number;
    limit?: number;
    type?: string;
    level?: string;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<CertificatesResponse> {
    return apiRequest<CertificatesResponse>({
      method: "GET",
      url: "/api/public/certificates",
      params,
    });
  },

  // Buscar certificados em destaque (público)
  async getFeatured(): Promise<CertificatesResponse> {
    return apiRequest<CertificatesResponse>({
      method: "GET",
      url: "/api/public/certificates/featured",
    });
  },

  // Buscar por ID (público)
  async getById(id: string): Promise<{ success: boolean; data: Certificate }> {
    return apiRequest({
      method: "GET",
      url: `/api/public/certificates/${id}`,
    });
  },

  // Buscar tipos disponíveis (público)
  async getTypes(): Promise<{ success: boolean; data: string[] }> {
    return apiRequest({
      method: "GET",
      url: "/api/public/certificates/types",
    });
  },

  // Buscar níveis disponíveis (público)
  async getLevels(): Promise<{ success: boolean; data: string[] }> {
    return apiRequest({
      method: "GET",
      url: "/api/public/certificates/levels",
    });
  },

  // Verificar certificado (público)
  async verify(credentialId: string): Promise<{
    success: boolean;
    data: {
      valid: boolean;
      certificate?: Certificate;
      verificationDetails?: {
        verifiedAt: string;
        method: string;
        issuerConfirmed: boolean;
      };
    };
  }> {
    return apiRequest({
      method: "POST",
      url: "/api/public/certificates/verify",
      data: { credentialId },
    });
  },

  // === ROTAS ADMINISTRATIVAS (necessitam autenticação) ===

  // Criar novo certificado
  async create(certificateData: FormData): Promise<{ success: boolean; data: Certificate }> {
    return apiRequest({
      method: "POST",
      url: "/api/admin/certificates",
      data: certificateData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Atualizar certificado
  async update(id: string, certificateData: FormData): Promise<{ success: boolean; data: Certificate }> {
    return apiRequest({
      method: "PUT",
      url: `/api/admin/certificates/${id}`,
      data: certificateData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Deletar certificado
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest({
      method: "DELETE",
      url: `/api/admin/certificates/${id}`,
    });
  },

  // Buscar certificados para admin
  async getAdminCertificates(params?: {
    page?: number;
    limit?: number;
    type?: string;
    level?: string;
    search?: string;
  }): Promise<CertificatesResponse> {
    return apiRequest<CertificatesResponse>({
      method: "GET",
      url: "/api/admin/certificates",
      params,
    });
  },

  // Marcar/desmarcar certificado como destaque
  async toggleFeatured(id: string): Promise<{ success: boolean; data: Certificate }> {
    return apiRequest({
      method: "PATCH",
      url: `/api/admin/certificates/${id}/featured`,
    });
  },

  // Atualizar status de verificação
  async updateVerificationStatus(
    id: string,
    status: {
      verified: boolean;
      notes?: string;
      method: string;
    }
  ): Promise<{ success: boolean; data: Certificate }> {
    return apiRequest({
      method: "PATCH",
      url: `/api/admin/certificates/${id}/verification`,
      data: status,
    });
  },

  // Buscar estatísticas de certificados
  async getStats(): Promise<{
    success: boolean;
    data: {
      total: number;
      verified: number;
      byType: Array<{ type: string; count: number }>;
      byLevel: Array<{ level: string; count: number }>;
      expiringSoon: number;
      recentlyAdded: number;
    };
  }> {
    return apiRequest({
      method: "GET",
      url: "/api/admin/certificates/stats",
    });
  },

  // Renovar certificado (criar nova versão)
  async renew(
    id: string,
    renewalData: {
      newIssueDate: string;
      newExpiryDate?: string;
      newCredentialId?: string;
      newCredentialUrl?: string;
      courseHours?: number;
      examScore?: number;
    }
  ): Promise<{ success: boolean; data: Certificate }> {
    return apiRequest({
      method: "POST",
      url: `/api/admin/certificates/${id}/renew`,
      data: renewalData,
    });
  },
};
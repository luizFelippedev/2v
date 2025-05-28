// src/services/projects.service.ts
import { apiRequest } from "@/lib/api";

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  status: string;
  technologies: Array<{
    name: string;
    category: string;
    color?: string;
  }>;
  featuredImage: string;
  gallery?: string[];
  links: {
    live?: string;
    github?: string;
    documentation?: string;
  };
  featured: boolean;
  views: number;
  likes: number;
  startDate: string;
  endDate?: string;
  team?: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  challenges?: string[];
  solutions?: string[];
  results?: Array<{
    metric: string;
    value: string;
    description: string;
  }>;
  testimonials?: Array<{
    author: string;
    role: string;
    content: string;
    rating: number;
  }>;
  relatedProjects?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: {
    project: Project;
    related?: Project[];
  };
}

export const projectsService = {
  // Buscar todos os projetos (público)
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ProjectsResponse> {
    return apiRequest<ProjectsResponse>({
      method: "GET",
      url: "/api/public/projects",
      params,
    });
  },

  // Buscar projeto por slug (público)
  async getBySlug(slug: string): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>({
      method: "GET",
      url: `/api/public/projects/${slug}`,
    });
  },

  // Buscar projetos em destaque (público)
  async getFeatured(): Promise<ProjectsResponse> {
    return apiRequest<ProjectsResponse>({
      method: "GET",
      url: "/api/public/projects/featured",
    });
  },

  // Buscar categorias disponíveis (público)
  async getCategories(): Promise<{ success: boolean; data: string[] }> {
    return apiRequest({
      method: "GET",
      url: "/api/public/projects/categories",
    });
  },

  // === ROTAS ADMINISTRATIVAS (necessitam autenticação) ===

  // Criar novo projeto
  async create(projectData: FormData): Promise<{ success: boolean; data: Project }> {
    return apiRequest({
      method: "POST",
      url: "/api/admin/projects",
      data: projectData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Atualizar projeto
  async update(id: string, projectData: FormData): Promise<{ success: boolean; data: Project }> {
    return apiRequest({
      method: "PUT",
      url: `/api/admin/projects/${id}`,
      data: projectData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Deletar projeto
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest({
      method: "DELETE",
      url: `/api/admin/projects/${id}`,
    });
  },

  // Buscar projetos para admin (com mais detalhes)
  async getAdminProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<ProjectsResponse> {
    return apiRequest<ProjectsResponse>({
      method: "GET",
      url: "/api/admin/projects",
      params,
    });
  },

  // Buscar analytics de um projeto
  async getProjectAnalytics(
    id: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{
    success: boolean;
    data: {
      views: number;
      likes: number;  
      shares: number;
      clickThroughs: number;
      dailyViews: Array<{ date: string; views: number }>;
    };
  }> {
    return apiRequest({
      method: "GET",
      url: `/api/admin/projects/${id}/analytics`,
      params,
    });
  },

  // Marcar/desmarcar projeto como favorito
  async toggleFeatured(id: string): Promise<{ success: boolean; data: Project }> {
    return apiRequest({
      method: "PATCH",
      url: `/api/admin/projects/${id}/featured`,
    });
  },

  // Curtir projeto (público)
  async likeProject(id: string): Promise<{ success: boolean; likes: number }> {
    return apiRequest({
      method: "POST",
      url: `/api/public/projects/${id}/like`,
    });
  },

  // Registrar visualização de projeto (público)
  async recordView(slug: string): Promise<void> {
    try {
      await apiRequest({
        method: "POST",
        url: `/api/public/projects/${slug}/view`,
      });
    } catch (error) {
      // Falha silenciosa para analytics
      console.warn("Failed to record project view:", error);
    }
  },
};
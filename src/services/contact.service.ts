// src/services/contact.service.ts
import { apiRequest } from "@/lib/api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  projectType?: string;
  phone?: string;
  company?: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests?: string[];
}

export const contactService = {
  // Enviar formulário de contato
  async submitContactForm(formData: ContactFormData): Promise<{
    success: boolean;
    message: string;
    data?: {
      id: string;
      submittedAt: string;
    };
  }> {
    return apiRequest({
      method: "POST",
      url: "/api/public/contact",
      data: formData,
    });
  },

  // Inscrever na newsletter
  async subscribeNewsletter(subscriptionData: NewsletterSubscription): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest({
      method: "POST",
      url: "/api/public/newsletter/subscribe",
      data: subscriptionData,
    });
  },

  // Cancelar inscrição na newsletter
  async unsubscribeNewsletter(email: string, token?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest({
      method: "POST",
      url: "/api/public/newsletter/unsubscribe",
      data: { email, token },
    });
  },

  // Buscar informações de contato (público)
  async getContactInfo(): Promise<{
    success: boolean;
    data: {
      email: string;
      phone?: string;
      location: string;
      socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
      };
      availability: {
        status: "available" | "busy" | "unavailable";
        message?: string;
        nextAvailable?: string;
      };
    };
  }> {
    return apiRequest({
      method: "GET",
      url: "/api/public/contact/info",
    });
  },

  // === ROTAS ADMINISTRATIVAS ===

  // Buscar mensagens de contato (admin)
  async getContactMessages(params?: {
    page?: number;
    limit?: number;
    status?: "new" | "read" | "replied" | "archived";
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      status: string;
      createdAt: string;
      repliedAt?: string;
      budget?: string;
      timeline?: string;
      projectType?: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }> {
    return apiRequest({
      method: "GET",
      url: "/api/admin/contact/messages",
      params,
    });
  },

  // Marcar mensagem como lida
  async markAsRead(messageId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest({
      method: "PATCH",
      url: `/api/admin/contact/messages/${messageId}/read`,
    });
  },

  // Responder mensagem
  async replyToMessage(
    messageId: string,
    replyData: {
      subject: string;
      message: string;
      copyToSender?: boolean;
    }
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest({
      method: "POST",
      url: `/api/admin/contact/messages/${messageId}/reply`,
      data: replyData,
    });
  },

  // Arquivar mensagem
  async archiveMessage(messageId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest({
      method: "PATCH",
      url: `/api/admin/contact/messages/${messageId}/archive`,
    });
  },

  // Deletar mensagem
  async deleteMessage(messageId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest({
      method: "DELETE",
      url: `/api/admin/contact/messages/${messageId}`,
    });
  },

  // Buscar estatísticas de contato
  async getContactStats(): Promise<{
    success: boolean;
    data: {
      totalMessages: number;
      newMessages: number;
      repliedMessages: number;
      averageResponseTime: number;
      popularTopics: Array<{ topic: string; count: number }>;
      monthlyStats: Array<{ month: string; messages: number; replies: number }>;
    };
  }> {
    return apiRequest({
      method: "GET",
      url: "/api/admin/contact/stats",
    });
  },

  // Buscar assinantes da newsletter (admin)
  async getNewsletterSubscribers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "unsubscribed";
  }): Promise<{
    success: boolean;
    data: Array<{
      id: string;
      email: string;
      name?: string;
      subscribedAt: string;
      status: string;
      interests?: string[];
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }> {
    return apiRequest({
      method: "GET",
      url: "/api/admin/newsletter/subscribers",
      params,
    });
  },

  // Enviar newsletter (admin)
  async sendNewsletter(newsletterData: {
    subject: string;
    content: string;
    template?: string;
    scheduledFor?: string;
    targetAudience?: {
      interests?: string[];
      excludeUnsubscribed?: boolean;
    };
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      id: string;
      recipientCount: number;
      scheduledFor?: string;
    };
  }> {
    return apiRequest({
      method: "POST",
      url: "/api/admin/newsletter/send",
      data: newsletterData,
    });
  },
};
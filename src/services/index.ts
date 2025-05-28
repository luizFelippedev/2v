// src/services/index.ts
// Exportar todos os serviços de API

export * from './auth.service';
export * from './projects.service';
export * from './certificates.service';
export * from './contact.service';


// Re-exportar API config
export { api, apiRequest, checkApiHealth } from '@/lib/api';

// Tipos importantes
export type {
  LoginRequest,
  AuthResponse,
  User,
} from './auth.service';

export type {
  Project,
  ProjectsResponse,
  ProjectResponse,
} from './projects.service';

export type {
  Certificate,
  CertificatesResponse,
} from './certificates.service';

export type {
  ContactFormData,
  NewsletterSubscription,
} from './contact.service';
// src/contexts/DataContext.tsx (atualizado)
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ApiService } from "@/services/api.service";
import { useNotification } from "@/hooks/useNotification";
import { Project, Certificate } from "@/types";
import {
  FaReact,
  FaNodeJs,
  FaJava,
  FaPhp,
  FaDocker,
  FaAws,
  FaPython,
} from "react-icons/fa";
import {
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiNextdotjs,
  SiNuxtdotjs,
  SiRedis,
  SiJavascript,
  SiSharp,
} from "react-icons/si";

interface Technology {
  name: string;
  icon: React.ReactNode;
  color: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "mobile"
    | "design";
}

interface DataContextType {
  projects: Project[];
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setCertificates: (certificates: Certificate[]) => void;
  fetchProjects: (params?: any) => Promise<void>;
  fetchCertificates: (params?: any) => Promise<void>;
  fetchFeaturedProjects: () => Promise<void>;
  fetchProjectBySlug: (slug: string) => Promise<Project | null>;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (id: string, updates: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  technologyIcons: Record<string, { icon: React.ReactNode; color: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const technologyIcons: DataContextType["technologyIcons"] = {
    React: { icon: <FaReact />, color: "#61DAFB" },
    "Vue.js": { icon: <SiJavascript />, color: "#42b883" },
    Angular: { icon: <SiJavascript />, color: "#DD0031" },
    JavaScript: { icon: <SiJavascript />, color: "#F7DF1E" },
    TypeScript: { icon: <SiTypescript />, color: "#3178C6" },
    "Node.js": { icon: <FaNodeJs />, color: "#339933" },
    Python: { icon: <FaPython />, color: "#3776AB" },
    Java: { icon: <FaJava />, color: "#ED8B00" },
    "C#": { icon: <SiSharp />, color: "#239120" },
    PHP: { icon: <FaPhp />, color: "#777BB4" },
    MongoDB: { icon: <SiMongodb />, color: "#47A248" },
    PostgreSQL: { icon: <SiPostgresql />, color: "#336791" },
    MySQL: { icon: <SiMysql />, color: "#4479A1" },
    Redis: { icon: <SiRedis />, color: "#DC382D" },
    Docker: { icon: <FaDocker />, color: "#2496ED" },
    AWS: { icon: <FaAws />, color: "#FF9900" },
    Firebase: { icon: <SiFirebase />, color: "#FFCA28" },
    "Next.js": { icon: <SiNextdotjs />, color: "#000000" },
    "Nuxt.js": { icon: <SiNuxtdotjs />, color: "#00C58E" },
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchProjects();
    fetchCertificates();
  }, []);

  // Buscar projetos
  const fetchProjects = async (params?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.getProjects(params);
      
      if (response.success) {
        setProjects(response.data.projects || []);
      } else {
        setError(response.message || "Erro ao buscar projetos");
        showNotification("Erro ao buscar projetos", "error");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao buscar projetos";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar certificados
  const fetchCertificates = async (params?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.getCertificates(params);
      
      if (response.success) {
        setCertificates(response.data || []);
      } else {
        setError(response.message || "Erro ao buscar certificados");
        showNotification("Erro ao buscar certificados", "error");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao buscar certificados";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar projetos em destaque
  const fetchFeaturedProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.getFeaturedProjects();
      
      if (response.success) {
        setProjects(response.data.projects || []);
        return response.data.projects;
      } else {
        setError(response.message || "Erro ao buscar projetos em destaque");
        showNotification("Erro ao buscar projetos em destaque", "error");
        return [];
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao buscar projetos em destaque";
      setError(errorMessage);
      showNotification(errorMessage, "error");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar projeto por slug
  const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await ApiService.getProjectBySlug(slug);
      
      if (response.success) {
        return response.data.project || null;
      } else {
        setError(response.message || "Erro ao buscar projeto");
        showNotification("Erro ao buscar projeto", "error");
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao buscar projeto";
      setError(errorMessage);
      showNotification(errorMessage, "error");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = (project: Project) =>
    setProjects((prev) => [...prev, project]);

  const updateProject = (id: string, updates: Partial<Project>) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );

  const deleteProject = (id: string) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  const addCertificate = (certificate: Certificate) =>
    setCertificates((prev) => [...prev, certificate]);

  const updateCertificate = (id: string, updates: Partial<Certificate>) =>
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );

  const deleteCertificate = (id: string) =>
    setCertificates((prev) => prev.filter((c) => c.id !== id));

  const value: DataContextType = {
    projects,
    certificates,
    isLoading,
    error,
    setProjects,
    setCertificates,
    fetchProjects,
    fetchCertificates,
    fetchFeaturedProjects,
    fetchProjectBySlug,
    addProject,
    updateProject,
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    technologyIcons,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
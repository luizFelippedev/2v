// src/app/admin/projects/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, ExternalLink, Eye, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Mock data
  const projects = [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Plataforma completa de e-commerce com React e Node.js",
      status: "completed",
      technologies: ["React", "Node.js", "PostgreSQL"],
      createdAt: "2024-01-15",
      views: 1250,
      featured: true,
    },
    {
      id: "2", 
      title: "AI Chat Assistant",
      description: "Assistente de chat inteligente usando OpenAI GPT",
      status: "in_progress",
      technologies: ["React Native", "OpenAI", "Firebase"],
      createdAt: "2024-02-01",
      views: 890,
      featured: false,
    },
    {
      id: "3",
      title: "Portfolio Dashboard", 
      description: "Dashboard administrativo para gerenciamento de portfolio",
      status: "completed",
      technologies: ["Next.js", "TypeScript", "MongoDB"],
      createdAt: "2023-11-10",
      views: 567,
      featured: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "planning":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "in_progress":
        return "Em Progresso";
      case "planning":
        return "Planejamento";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gerenciar Projetos</h1>
          <p className="text-gray-400">Gerencie seus projetos e portfólio</p>
        </div>
        <Link href="/admin/projects/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Projeto</span>
          </motion.button>
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all" className="bg-gray-800">Todos os Status</option>
            <option value="completed" className="bg-gray-800">Concluído</option>
            <option value="in_progress" className="bg-gray-800">Em Progresso</option>
            <option value="planning" className="bg-gray-800">Planejamento</option>
          </select>
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          Encontrados {projects.length} projeto(s)
        </div>
      </motion.div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-primary-500/50 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{project.description}</p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.views} visualizações</span>
                      </div>
                      <div>
                        Criado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  <div className={`px-3 py-1 border rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                  title="Visualizar"
                >
                  <Eye className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded-lg transition-colors"
                  title="Ver no site"
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.button>

                <Link href={`/admin/projects/${project.id}/edit`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-400 mb-6">
            Comece criando seu primeiro projeto.
          </p>
          <Link href="/admin/projects/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
            >
              Criar Primeiro Projeto
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
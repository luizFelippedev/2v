// src/app/admin/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Calendar,
  Activity,
  ChevronRight,
  FileText,
  Globe,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts";
import Link from "next/link";

// Admin Dashboard Component
export default function AdminDashboard() {
  const { state: authState } = useAuth();
  const [stats, setStats] = useState({
    projects: 12,
    certificates: 8,
    visitors: 2547,
    views: 15234,
  });

  const quickStats = [
    {
      label: "Projetos",
      value: stats.projects,
      icon: <Briefcase className="w-6 h-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      change: "+2 este mês",
      trend: "up",
    },
    {
      label: "Certificados",
      value: stats.certificates,
      icon: <Award className="w-6 h-6" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      change: "+1 este mês",
      trend: "up",
    },
    {
      label: "Visitantes",
      value: stats.visitors,
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      change: "+15% este mês",
      trend: "up",
    },
    {
      label: "Visualizações",
      value: stats.views,
      icon: <Eye className="w-6 h-6" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      change: "+23% este mês",
      trend: "up",
    },
  ];

  const recentActivities = [
    {
      type: "project",
      title: "Novo projeto 'E-commerce Platform' criado",
      time: "2 horas atrás",
      icon: <Briefcase className="w-4 h-4" />,
      color: "text-blue-400",
    },
    {
      type: "certificate",
      title: "Certificado AWS Solutions Architect adicionado",
      time: "1 dia atrás",
      icon: <Award className="w-4 h-4" />,
      color: "text-green-400",
    },
    {
      type: "visit",
      title: "50 novas visualizações no portfolio",
      time: "2 dias atrás",
      icon: <Eye className="w-4 h-4" />,
      color: "text-purple-400",
    },
    {
      type: "contact",
      title: "Nova mensagem de contato recebida",
      time: "3 dias atrás",
      icon: <MessageSquare className="w-4 h-4" />,
      color: "text-orange-400",
    },
  ];

  const quickActions = [
    {
      label: "Novo Projeto",
      description: "Adicionar um novo projeto",
      href: "/admin/projects/new",
      icon: <Plus className="w-5 h-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Novo Certificado",
      description: "Adicionar certificação",
      href: "/admin/certificates/new",
      icon: <Award className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      label: "Ver Analytics",
      description: "Visualizar métricas",
      href: "/admin/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-purple-500",
    },
    {
      label: "Configurações",
      description: "Gerenciar configurações",
      href: "/admin/settings",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-400">
            Bem-vindo de volta, {authState.user?.name}! 👋
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>Ver Site</span>
          </Link>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary-400" />
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                        {action.label}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {action.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-secondary-400" />
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className={`p-2 rounded-lg bg-white/10 ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">
                      {activity.title}
                    </div>
                    <div className="text-gray-400 text-sm">{activity.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/admin/activities"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center"
              >
                Ver todas as atividades
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projects Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Projetos</h3>
            <Link
              href="/admin/projects"
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <div className="text-white font-medium">E-commerce Platform</div>
                <div className="text-gray-400 text-sm">React, Node.js</div>
              </div>
              <div className="text-green-400 text-sm font-medium">Concluído</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <div className="text-white font-medium">AI Chat Assistant</div>
                <div className="text-gray-400 text-sm">React Native, OpenAI</div>
              </div>
              <div className="text-yellow-400 text-sm font-medium">Em progresso</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <div className="text-white font-medium">Portfolio Dashboard</div>
                <div className="text-gray-400 text-sm">Next.js, TypeScript</div>
              </div>
              <div className="text-green-400 text-sm font-medium">Concluído</div>
            </div>
          </div>
        </motion.div>

        {/* Certificates Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Certificações</h3>
            <Link
              href="/admin/certificates"
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <div className="text-white font-medium">AWS Solutions Architect</div>
                <div className="text-gray-400 text-sm">Amazon Web Services</div>
              </div>
              <div className="text-green-400 text-sm font-medium">Ativo</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <div className="text-white font-medium">React Native Specialization</div>
                <div className="text-gray-400 text-sm">Meta</div>
              </div>
              <div className="text-green-400 text-sm font-medium">Ativo</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <div className="text-white font-medium">TensorFlow Developer</div>
                <div className="text-gray-400 text-sm">Google</div>
              </div>
              <div className="text-green-400 text-sm font-medium">Ativo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
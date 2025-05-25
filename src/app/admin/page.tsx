"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  ChevronRight,
  LogOut,
  AlertCircle,
  FileText,
  ThumbsUp, // Adicionando importação do ThumbsUp
  Share2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardGrid } from "@/components/admin/DashboardGrid";
import { MetricsCard } from "@/components/admin/MetricsCard";
import { ActivityStream } from "@/components/admin/ActivityStream";
import { Card } from "@/components/ui/Card";

// Admin Dashboard Component
export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const activeTabParam = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(activeTabParam || "overview");
  const { state: authState, logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.replace("/login");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  // Handle tab changes from URL
  useEffect(() => {
    if (activeTabParam && activeTabParam !== activeTab) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam, activeTab]);

  // Tab change handler
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/admin?tab=${tabId}`, { scroll: false });
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Erro ao fazer logout");
    }
  };

  // Mock data para os widgets
  const dashboardWidgets = [
    {
      id: "visits",
      title: "Visitas",
      type: "metric" as const,
      size: "small" as const, // Especificar literalmente como "small"
      component: (
        <MetricsCard
          data={{
            value: 15234,
            previousValue: 12500,
            label: "Visitas este mês",
            type: "number",
            color: "#3b82f6",
          }}
        />
      ),
    },
    {
      id: "projects",
      title: "Projetos",
      type: "metric" as const,
      size: "small" as const, // Especificar literalmente como "small"
      component: (
        <MetricsCard
          data={{
            value: 52,
            previousValue: 45,
            label: "Projetos totais",
            type: "number",
            color: "#10b981",
          }}
        />
      ),
    },
    {
      id: "activity",
      title: "Atividades Recentes",
      type: "list" as const,
      size: "large" as const, // Especificar literalmente como "large"
      component: <ActivityStream />,
    },
  ];

  // Display loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Erro</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // If not authenticated, show error message with login button
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Negado</h2>
          <p className="text-slate-300 mb-6">
            Você precisa estar autenticado para acessar esta página.
          </p>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-colors"
            >
              Fazer Login
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Usuários", value: "150+", icon: Users, change: "+12%" },
    { label: "Projetos", value: "45", icon: FileText, change: "+5%" },
    { label: "Certificados", value: "28", icon: Award, change: "+2%" },
    { label: "Visitas", value: "10k+", icon: Activity, change: "+25%" },
  ];

  const metrics = [
    { label: "Visualizações", value: "25.5k", icon: Eye },
    { label: "Curtidas", value: "1.2k", icon: ThumbsUp },
    { label: "Compartilhamentos", value: "845", icon: Share2 },
    { label: "Comentários", value: "328", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dashboard Administrativo
              </h1>
              <p className="text-slate-400 mt-2">
                Bem-vindo de volta, {authState.user?.name || "Admin"}! 👋
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="mr-2">Ver site</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover={false} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <stat.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <span
                    className={`text-sm ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Card hover={false} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <metric.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                    <p className="text-xl font-semibold text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Grid de Widgets */}
        <DashboardGrid initialItems={dashboardWidgets} />
      </div>
    </div>
  );
}

// Overview Tab Component
const OverviewTab: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-400" />
        Atividades Recentes
      </h3>
      <div className="space-y-4">
        {[
          {
            title: "Novo projeto React criado",
            time: "2 horas atrás",
            type: "project",
            link: "/admin?tab=projects",
          },
          {
            title: "Certificado AWS adicionado",
            time: "1 dia atrás",
            type: "certificate",
            link: "/admin?tab=certificates",
          },
          {
            title: "50 novas visualizações",
            time: "2 dias atrás",
            type: "view",
            link: "#",
          },
        ].map((activity, index) => (
          <Link key={index} href={activity.link}>
            <motion.div
              whileHover={{ scale: 1.01, x: 4 }}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div
                className={`p-2 rounded-lg ${
                  activity.type === "project"
                    ? "bg-blue-500/20 text-blue-400"
                    : activity.type === "certificate"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {activity.type === "project" && (
                  <Briefcase className="w-4 h-4" />
                )}
                {activity.type === "certificate" && (
                  <Award className="w-4 h-4" />
                )}
                {activity.type === "view" && <Eye className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  {activity.title}
                </div>
                <div className="text-slate-400 text-xs">{activity.time}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>

    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
      <div className="space-y-3">
        {[
          {
            label: "Novo Projeto",
            icon: <Plus className="w-4 h-4" />,
            color: "bg-blue-500",
            link: "/admin/projects/new",
          },
          {
            label: "Novo Certificado",
            icon: <Award className="w-4 h-4" />,
            color: "bg-green-500",
            link: "/admin/certificates/new",
          },
          {
            label: "Ver Analytics",
            icon: <BarChart3 className="w-4 h-4" />,
            color: "bg-purple-500",
            link: "/admin/analytics",
          },
        ].map((action, index) => (
          <Link key={index} href={action.link}>
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                {action.icon}
              </div>
              <span className="text-white text-sm font-medium">
                {action.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

// Projects Tab Component
const ProjectsTab: React.FC = () => (
  <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-white">Gerenciar Projetos</h3>
      <Link href="/admin/projects/new">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </motion.button>
      </Link>
    </div>

    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -2, x: 2 }}
          className="p-4 bg-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Projeto {index + 1}</h4>
              <p className="text-slate-400 text-sm">
                Descrição breve do projeto
              </p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/projects/${index + 1}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Certificates Tab Component
const CertificatesTab: React.FC = () => (
  <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-white">Gerenciar Certificados</h3>
      <Link href="/admin/certificates/new">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Certificado</span>
        </motion.button>
      </Link>
    </div>

    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -2, x: 2 }}
          className="p-4 bg-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">
                Certificado {index + 1}
              </h4>
              <p className="text-slate-400 text-sm">Certificação profissional</p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/certificates/${index + 1}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab: React.FC = () => (
  <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
    <h3 className="text-xl font-bold text-white mb-6">
      Configurações do Sistema
    </h3>

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
          <h4 className="text-lg font-medium text-white mb-4">
            Perfil de Usuário
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 text-sm">Nome</label>
              <input
                type="text"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white mt-1 focus:border-blue-500 focus:outline-none"
                defaultValue="Admin User"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm">Email</label>
              <input
                type="email"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white mt-1 focus:border-blue-500 focus:outline-none"
                defaultValue="admin@portfolio.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
          <h4 className="text-lg font-medium text-white mb-4">
            Configurações do Site
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 text-sm">Título do Site</label>
              <input
                type="text"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white mt-1 focus:border-blue-500 focus:outline-none"
                defaultValue="Portfolio Profissional"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm">Descrição</label>
              <input
                type="text"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white mt-1 focus:border-blue-500 focus:outline-none"
                defaultValue="Meu portfolio profissional de desenvolvedor"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          Salvar Configurações
        </motion.button>
      </div>
    </div>
  </div>
);
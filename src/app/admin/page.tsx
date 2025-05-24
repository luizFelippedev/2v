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
} from "lucide-react";
import { useAuth } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Admin Dashboard Component
export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const activeTabParam = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(activeTabParam || "overview");
  const { state: authState, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Aguardar um momento para o contexto de auth inicializar
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (!authState.isAuthenticated) {
          console.log("Usuário não autenticado, redirecionando para login...");
          router.replace("/login");
          return;
        }

        console.log("Usuário autenticado:", authState.user?.email);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setError("Erro ao verificar autenticação");
        setLoading(false);
      }
    };

    checkAuth();
  }, [authState.isAuthenticated, router]);

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

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">
            Carregando dashboard...
          </h2>
          <p className="text-slate-400 mt-2">Verificando credenciais</p>
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

  // Dashboard tabs
  const tabs = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "projects",
      label: "Projetos",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: "certificates",
      label: "Certificados",
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Configurações",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Mock stats data
  const stats = {
    totalProjects: 12,
    totalCertificates: 8,
    totalUsers: 1247,
    totalViews: 45231,
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
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

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Projetos",
              value: stats.totalProjects,
              icon: <Briefcase className="w-5 h-5" />,
              color: "bg-blue-500",
              href: "/admin?tab=projects",
            },
            {
              title: "Certificados",
              value: stats.totalCertificates,
              icon: <Award className="w-5 h-5" />,
              color: "bg-green-500",
              href: "/admin?tab=certificates",
            },
            {
              title: "Usuários",
              value: stats.totalUsers,
              icon: <Users className="w-5 h-5" />,
              color: "bg-purple-500",
              href: "#",
            },
            {
              title: "Visualizações",
              value: stats.totalViews,
              icon: <Eye className="w-5 h-5" />,
              color: "bg-orange-500",
              href: "#",
            },
          ].map((stat, index) => (
            <Link key={stat.title} href={stat.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-6 cursor-pointer hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${stat.color} text-white`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">{stat.title}</div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800 rounded-2xl border border-slate-700 p-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "projects" && <ProjectsTab />}
            {activeTab === "certificates" && <CertificatesTab />}
            {activeTab === "settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
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
// src/components/admin/AdminSidebar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Award,
  Settings,
  LogOut,
  Home,
  User,
  ChevronRight,
  Menu,
  X,
  Users,
  FileText,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { state: authState, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <BarChart3 className="w-5 h-5" />,
      exact: true,
    },
    {
      label: "Projetos",
      href: "/admin/projects",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Certificados",
      href: "/admin/certificates",
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "Usuários",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Configurações",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <React.Fragment>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 text-white"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed top-0 left-0 h-full w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                <p className="text-gray-400 text-xs">Portfolio Manager</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img
                src={authState.user?.avatar || "/images/placeholder-avatar.png"}
                alt={authState.user?.name}
                className="w-8 h-8 rounded-full border border-white/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {authState.user?.name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {authState.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive(item.href, item.exact)
                        ? "bg-primary-500/20 border border-primary-500/30 text-primary-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`${
                        isActive(item.href, item.exact)
                          ? "text-primary-400"
                          : "text-gray-500 group-hover:text-gray-300"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.href, item.exact) && (
                      <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Ver Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </React.Fragment>
  );
};
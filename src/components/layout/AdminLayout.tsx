"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só redirecionar após verificação completa de auth
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname || '/admin')}`);
    }
  }, [authState.isAuthenticated, authState.isLoading, router, pathname]);

  // Não renderizar nada até estar montado (SSR safety)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar loading enquanto verifica autenticação
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-white text-lg">Verificando permissões...</p>
          <p className="text-gray-400 text-sm mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se não autenticado
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Negado</h2>
          <p className="text-gray-300 mb-6">
            Você precisa estar autenticado para acessar esta página.
          </p>
          <div className="space-y-3">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl font-semibold text-white transition-colors"
              >
                Fazer Login
              </motion.button>
            </Link>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 border-2 border-primary-500 rounded-xl font-semibold text-white hover:bg-primary-500/10 transition-colors"
              >
                Voltar ao Site
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se é admin
  if (authState.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
          <p className="text-gray-300 mb-6">
            Esta área é restrita apenas para administradores.
          </p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl font-semibold text-white transition-colors"
            >
              Voltar ao Site
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  // Renderizar layout admin se autenticado e admin
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8 pt-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
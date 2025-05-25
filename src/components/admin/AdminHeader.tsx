"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, User, LogOut, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";

export const AdminHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    {
      id: "1",
      title: "Novo projeto adicionado",
      message: "O projeto E-commerce foi adicionado com sucesso.",
      time: "5 min atrás",
    },
    // ...existing code... (adicione mais notificações mock se necessário)
  ]);

  const { state: authState, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 right-0 left-[240px] h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Barra de Busca */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Ações do Lado Direito */}
        <div className="flex items-center space-x-4">
          {/* Menu de Notificações */}
          <div className="relative">
            <button
              className="p-2 hover:bg-white/10 rounded-lg relative"
              onClick={() => setShowUserMenu(false)} // Fechar outros menus
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
            </button>
          </div>

          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg"
            >
              <img
                src={authState.user?.avatar || "/api/placeholder/32/32"}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-white/20"
              />
              <span className="text-white">{authState.user?.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl"
                >
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push("/admin/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push("/admin/settings");
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </button>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

// src/app/admin/settings/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  User, 
  Globe, 
  Shield, 
  Palette, 
  Bell, 
  Database,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/contexts";

export default function AdminSettingsPage() {
  const { state: authState } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: authState.user?.name || "",
    email: authState.user?.email || "",
    bio: "Engenheiro de Software Full Stack especializado em React, Node.js e IA",
    location: "São Paulo, Brasil",
    website: "https://luizfelippe.dev",
    github: "https://github.com/luizfelippe",
    linkedin: "https://linkedin.com/in/luizfelippe",
    twitter: "https://twitter.com/luizfelippe",
  });

  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "Luiz Felippe - Portfolio",
    siteDescription: "Portfolio profissional de Luiz Felippe",
    siteKeywords: "React, Node.js, TypeScript, IA, Desenvolvedor",
    contactEmail: "luizfelippeandrade@outlook.com",
    phone: "+55 (11) 95232-3645",
    analytics: true,
    maintenance: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginNotifications: true,
  });

  const tabs = [
    { id: "profile", name: "Perfil", icon: <User className="w-5 h-5" /> },
    { id: "site", name: "Site", icon: <Globe className="w-5 h-5" /> },
    { id: "security", name: "Segurança", icon: <Shield className="w-5 h-5" /> },
    { id: "appearance", name: "Aparência", icon: <Palette className="w-5 h-5" /> },
    { id: "notifications", name: "Notificações", icon: <Bell className="w-5 h-5" /> },
  ];

  const handleSave = (section: string) => {
    // Implementar lógica de salvamento
    console.log(`Salvando configurações de ${section}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie suas configurações e preferências</p>
      </div>

      {/* Tabs */}
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-primary-500/20 border border-primary-500/30 text-primary-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white">Informações do Perfil</h3>
            
            {/* Avatar Upload */}
            <div className="flex items-center space-x-6">
              <img
                src={authState.user?.avatar || "/images/placeholder-avatar.png"}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-2 border-white/20"
              />
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-lg text-primary-400 hover:bg-primary-500/30 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Alterar Avatar</span>
                </motion.button>
                <p className="text-gray-400 text-sm mt-2">PNG, JPG até 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSave("profile")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Perfil</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Site Tab */}
        {activeTab === "site" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white">Configurações do Site</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título do Site
                </label>
                <input
                  type="text"
                  value={siteSettings.siteTitle}
                  onChange={(e) => setSiteSettings({...siteSettings, siteTitle: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email de Contato
                </label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição do Site
                </label>
                <textarea
                  rows={3}
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-white">Opções do Site</h4>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">Google Analytics</p>
                  <p className="text-gray-400 text-sm">Rastrear visitantes do site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.analytics}
                    onChange={(e) => setSiteSettings({...siteSettings, analytics: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">Modo Manutenção</p>
                  <p className="text-gray-400 text-sm">Mostrar página de manutenção</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteSettings.maintenance}
                    onChange={(e) => setSiteSettings({...siteSettings, maintenance: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSave("site")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Configurações</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white">Configurações de Segurança</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-white mb-4">Alterar Senha</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">Opções de Segurança</h4>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Autenticação de Dois Fatores</p>
                    <p className="text-gray-400 text-sm">Adicionar camada extra de segurança</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactor}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactor: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Notificações de Login</p>
                    <p className="text-gray-400 text-sm">Receber email quando alguém fizer login</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.loginNotifications}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSave("security")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Segurança</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white">Aparência</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Theme Options */}
              {[
                { name: "Escuro", value: "dark", colors: ["#0f172a", "#60a5fa", "#a78bfa"] },
                { name: "Claro", value: "light", colors: ["#ffffff", "#3b82f6", "#8b5cf6"] },
                { name: "Cyberpunk", value: "cyberpunk", colors: ["#0a0a0a", "#00ffff", "#ff00ff"] },
                { name: "Neon", value: "neon", colors: ["#000000", "#ff0080", "#8000ff"] },
                { name: "Matrix", value: "matrix", colors: ["#000000", "#00ff41", "#008f11"] },
              ].map((theme) => (
                <motion.div
                  key={theme.value}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary-500/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex space-x-1">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-white font-medium">{theme.name}</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Tema {theme.name.toLowerCase()} para o painel
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-white">Preferências Visuais</h4>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">Animações</p>
                  <p className="text-gray-400 text-sm">Habilitar animações na interface</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">Efeito Glass</p>
                  <p className="text-gray-400 text-sm">Usar efeito de vidro nos componentes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">Partículas de Fundo</p>
                  <p className="text-gray-400 text-sm">Mostrar partículas animadas no fundo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSave("appearance")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Aparência</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white">Preferências de Notificação</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-white mb-4">Email</h4>
                <div className="space-y-4">
                  {[
                    { name: "Novas mensagens de contato", desc: "Quando alguém enviar uma mensagem" },
                    { name: "Comentários em projetos", desc: "Quando alguém comentar em seus projetos" },
                    { name: "Relatórios semanais", desc: "Resumo semanal de atividades" },
                    { name: "Atualizações de segurança", desc: "Alertas importantes de segurança" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-white mb-4">Push Notifications</h4>
                <div className="space-y-4">
                  {[
                    { name: "Atividade em tempo real", desc: "Notificações instantâneas de atividades" },
                    { name: "Lembretes", desc: "Lembretes de tarefas e compromissos" },
                    { name: "Atualizações do sistema", desc: "Notificações sobre atualizações" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index === 0} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSave("notifications")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Notificações</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
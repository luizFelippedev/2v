// src/app/login/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, LogIn, CheckCircle, Loader, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // New state for animation
  const { state: authState, login, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin';

  // Effect to handle redirection after authentication status is determined
  useEffect(() => {
    // Redireciona imediatamente se já autenticado e não está mostrando animação de sucesso
    if (!authState.isLoading && authState.isAuthenticated && !showSuccessAnimation) {
      router.replace(callbackUrl);
      return;
    }
    // Se login acabou de acontecer, mostra animação e redireciona após 1.5s
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        router.replace(callbackUrl);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [authState.isAuthenticated, authState.isLoading, router, callbackUrl, showSuccessAnimation]);

  // Clear error when user types
  useEffect(() => {
    if (authState.error && (formData.email !== "" || formData.password !== "")) {
      clearError();
    }
  }, [formData.email, formData.password, clearError, authState.error]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowSuccessAnimation(false); // Reset animation state on new submission

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        setShowSuccessAnimation(true); // Trigger success animation and subsequent redirect via useEffect
      }
    } catch (error) {
      // Error handling is managed by useAuth context. No need to console.error here.
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (type: "admin" | "luiz") => {
    clearError(); // Clear any existing errors
    if (type === "admin") {
      setFormData({
        email: "admin@portfolio.com",
        password: "admin123",
      });
    } else {
      setFormData({
        email: "luizfelippeandrade@outlook.com",
        password: "123456",
      });
    }
  };

  // Show global loading state if AuthContext is still checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-white text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If already authenticated but not showing success animation (e.g. initial load), show a brief message
  // This state is mainly for when a user directly navigates to /login while already authenticated.
  if (authState.isAuthenticated && !showSuccessAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-white text-lg">Você já está logado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Main login form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{
                rotate: showSuccessAnimation ? 0 : 360,
                scale: showSuccessAnimation ? 1.1 : 1
              }}
              transition={{
                duration: showSuccessAnimation ? 0.5 : 20,
                repeat: showSuccessAnimation ? 0 : Infinity,
                ease: showSuccessAnimation ? "easeOut" : "linear"
              }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
            >
              {showSuccessAnimation ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Shield className="w-8 h-8 text-white" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {showSuccessAnimation ? "Login Realizado!" : "Acesso Administrativo"}
            </h1>
            <p className="text-gray-400 mt-2">
              {showSuccessAnimation ? "Redirecionando para o painel..." : "Entre para acessar o painel"}
            </p>
          </div>

          {!showSuccessAnimation && (
            <>
              {/* Demo Credentials */}
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300 mb-3 font-medium">Credenciais de demonstração:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("admin")}
                    className="w-full text-left p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20"
                  >
                    <div className="text-xs text-blue-200 font-medium">👨‍💼 Admin</div>
                    <div className="text-xs text-blue-100">admin@portfolio.com / admin123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("luiz")}
                    className="w-full text-left p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/20"
                  >
                    <div className="text-xs text-green-200 font-medium">👨‍💻 Luiz Felippe</div>
                    <div className="text-xs text-green-100">luizfelippeandrade@outlook.com / 123456</div>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Digite seu email"
                      required
                      disabled={isSubmitting}
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 transition-all"
                        placeholder="Digite sua senha"
                        required
                        disabled={isSubmitting}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {authState.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authState.error}</span>
                    </motion.div>
                  )}

                  {/* Login Button */}
                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Entrar</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Back to Home */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center space-x-2"
                >
                  <span>← Voltar para o site</span>
                </Link>
              </div>
            </>
          )}

          {/* Success State */}
          {showSuccessAnimation && ( // Use the new state here
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Login realizado com sucesso!
              </h3>
              <p className="text-gray-400 mb-4">
                Redirecionando para o painel administrativo...
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
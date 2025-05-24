"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, AlertCircle, LogIn, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Definir o tipo explicitamente
type LoginStatus = "idle" | "success" | "error";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("idle");
  const { state: authState, login } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      router.push("/admin");
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error state when user types
    if (loginStatus === "error") {
      setLoginStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoginStatus("idle");

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        setLoginStatus("success");
        
        // Small delay to show success state before redirect
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        setLoginStatus("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (type: "admin" | "user") => {
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

  // Show loading if auth is being checked
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Don't show login if already authenticated
  if (authState.isAuthenticated) {
    return null;
  }

  const isSuccessStatus = loginStatus === "success";
  const isErrorStatus = loginStatus === "error";

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
              animate={{ rotate: isSuccessStatus ? 0 : 360 }}
              transition={{ duration: isSuccessStatus ? 0 : 20, repeat: isSuccessStatus ? 0 : Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
            >
              {isSuccessStatus ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Shield className="w-8 h-8 text-white" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {isSuccessStatus ? "Login Realizado!" : "Acesso Administrativo"}
            </h1>
            <p className="text-gray-400 mt-2">
              {isSuccessStatus ? "Redirecionando..." : "Entre para acessar o painel"}
            </p>
          </div>

          {!isSuccessStatus && (
            <>
              {/* Demo Credentials */}
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300 mb-3">Credenciais de demonstração:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("admin")}
                    className="w-full text-left p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    <div className="text-xs text-blue-200">Admin:</div>
                    <div className="text-xs text-blue-100">admin@portfolio.com / admin123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials("user")}
                    className="w-full text-left p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
                  >
                    <div className="text-xs text-green-200">Luiz Felippe:</div>
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Digite seu email"
                      required
                      disabled={isSubmitting}
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12 transition-all"
                        placeholder="Digite sua senha"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                  {(isErrorStatus || authState.error) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {authState.error || "Credenciais inválidas. Tente novamente."}
                      </span>
                    </motion.div>
                  )}

                  {/* Login Button */}
                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={isSubmitting || isSuccessStatus}
                    className={`w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all ${
                      isSuccessStatus
                        ? "bg-green-600"
                        : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : isSuccessStatus ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Login Realizado!</span>
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
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ← Voltar para o site
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
// src/components/ui/ErrorBoundary.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    // Log para serviço de monitoramento
    this.props.onError?.(error, errorInfo);
    
    // Enviar para analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true,
        error_id: this.state.errorId
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Ops! Algo deu errado
              </h2>

              <p className="text-gray-400 mb-6">
                Encontramos um erro inesperado. Nossa equipe foi notificada.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="text-xs text-red-400 bg-red-900/20 p-3 rounded overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleRetry}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl font-semibold text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tentar Novamente</span>
                </motion.button>

                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-white/20 rounded-xl font-semibold text-white hover:bg-white/10"
                  >
                    <Home className="w-4 h-4" />
                    <span>Ir para Home</span>
                  </motion.button>
                </Link>
              </div>

              {this.state.errorId && (
                <p className="text-xs text-gray-500 mt-4">
                  ID do erro: {this.state.errorId}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
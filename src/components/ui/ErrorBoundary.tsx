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
      if (this.props.fallback && this.state.error) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }
      // Fallback padrão
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Ocorreu um erro inesperado</h2>
          <p className="mb-4 text-gray-400">
            {this.state.error?.message || "Algo deu errado. Tente novamente."}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            Tentar Novamente
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-6 text-xs text-left bg-gray-900 text-red-300 p-4 rounded-lg overflow-x-auto max-w-xl mx-auto">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
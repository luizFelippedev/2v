// src/app/login/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, login, clearError } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (state.isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [state.isAuthenticated, router]);

  // Limpar erro ao desmontar componente
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Exibir erro de autenticação
  useEffect(() => {
    if (state.error) {
      showNotification(state.error, 'error');
    }
  }, [state.error, showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showNotification('Por favor, preencha todos os campos', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        router.push('/admin/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-background">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl bg-theme-surface shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-theme-primary">Login</h1>
          <p className="mt-2 text-theme-secondary">Acesse o painel administrativo</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-theme">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-theme">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-theme-background border border-theme-border rounded-md shadow-sm focus:outline-none focus:ring-theme-primary focus:border-theme-primary"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || state.isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50"
            >
              {isSubmitting || state.isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// src/contexts/AuthContext.tsx (atualizado)
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { ApiService } from "@/services/api.service";
import { User } from "@/types";
import { AUTH_STORAGE_KEYS } from "@/constants";
import { useNotification } from "@/hooks/useNotification";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_FAILED" }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };

    case "AUTH_FAILED":
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showNotification } = useNotification();

  // Verificar status de autenticação na inicialização
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: "AUTH_START" });
      
      // Verificar se existe token no localStorage
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      if (!token) {
        dispatch({ type: "AUTH_FAILED" });
        return;
      }

      // Verificar se o token é válido
      const response = await ApiService.verifyToken();
      
      if (response.success) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.data.user },
        });
      } else {
        dispatch({ type: "AUTH_FAILED" });
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      dispatch({ type: "AUTH_FAILED" });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await ApiService.login({ email, password });

      if (response.success) {
        // Salvar dados no localStorage
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.data.user },
        });
        
        showNotification('Login realizado com sucesso', 'success');
        return true;
      } else {
        dispatch({
          type: "AUTH_ERROR",
          payload: response.message || "Credenciais inválidas",
        });
        
        showNotification('Erro ao fazer login: ' + response.message, 'error');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao fazer login";
      dispatch({
        type: "AUTH_ERROR",
        payload: errorMessage,
      });
      
      showNotification('Erro ao fazer login: ' + errorMessage, 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
      // Limpar localStorage
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      
      dispatch({ type: "LOGOUT" });
      showNotification('Logout realizado com sucesso', 'success');
    } catch (error) {
      console.error("Logout error:", error);
      
      // Mesmo com erro, limpar dados locais
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      
      dispatch({ type: "LOGOUT" });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
// src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService, User } from "@/services/auth.service";

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

  // Verificar status de autenticação na inicialização
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Verificar se existe token no localStorage
      const token = authService.getToken();
      if (!token) {
        dispatch({ type: "AUTH_FAILED" });
        return;
      }

      // Verificar se o token é válido
      const response = await authService.verifyToken();
      
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

      const response = await authService.login({ email, password });

      if (response.success) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.data.user },
        });
        return true;
      } else {
        dispatch({
          type: "AUTH_ERROR",
          payload: response.message || "Credenciais inválidas",
        });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao fazer login";
      dispatch({
        type: "AUTH_ERROR",
        payload: errorMessage,
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
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
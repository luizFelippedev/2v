// src/contexts/AuthContext.tsx - Versão Melhorada
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forceLogin: (userData: User) => void; // Adicionar novo método
} | undefined>(undefined);

const clearAuthData = async (): Promise<void> => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  // Modificar o login para usar redirecionamento direto
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: "LOGIN_START" });
      
      if (email === "admin@portfolio.com" && password === "admin123") {
        const user = {
          id: "1",
          name: "Admin",
          email: "admin@portfolio.com",
          role: "admin" as const,
          avatar: "/images/placeholder-avatar.png"
        };
        
        const token = btoa(JSON.stringify({
          userId: user.id,
          exp: Date.now() + (24 * 60 * 60 * 1000)
        }));
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      }
      
      throw new Error("Credenciais inválidas");
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearAuthData();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const forceLogin = (userData: User): void => {
    const token = btoa(JSON.stringify({
      userId: userData.id,
      exp: Date.now() + (24 * 60 * 60 * 1000)
    }));
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, forceLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};

// Modificar loginAdmin
if (typeof window !== 'undefined') {
  window.loginAdmin = () => {
    const adminUser = {
      id: "1",
      name: "Admin",
      email: "admin@portfolio.com",
      role: "admin",
      avatar: "/images/placeholder-avatar.png"
    };
    
    localStorage.setItem('token', btoa(JSON.stringify({userId:"1",exp:Date.now()+86400000})));
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    // Usar replace para evitar histórico
    window.location.replace('/admin');
  };
}

// Atualizar a declaração global
declare global {
  interface Window {
    loginAdmin: () => void;
  }
}
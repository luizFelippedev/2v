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
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
} | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("portfolio_token");
        const userEmail = localStorage.getItem("user_email");
        const userName = localStorage.getItem("user_name");
        const userRole = localStorage.getItem("user_role");

        if (token && userEmail && userName && userRole) {
          const user: User = {
            id: "1",
            name: userName,
            email: userEmail,
            role: userRole as "admin" | "user",
            avatar: "/api/placeholder/40/40",
          };

          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const validCredentials = [
        { email: "admin@portfolio.com", password: "admin123", role: "admin", name: "Admin" },
        { email: "luizfelippeandrade@outlook.com", password: "123456", role: "admin", name: "Luiz Felippe" },
      ];

      const credential = validCredentials.find(
        (cred) => cred.email === email && cred.password === password
      );

      if (credential) {
        const user: User = {
          id: "1",
          name: credential.name,
          email: credential.email,
          role: credential.role as "admin",
          avatar: "/api/placeholder/40/40",
        };

        // Salvar no localStorage
        const token = `demo-jwt-token-${Date.now()}`;
        localStorage.setItem("portfolio_token", token);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_name", user.name);
        localStorage.setItem("user_role", user.role);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Limpar localStorage
      localStorage.removeItem("portfolio_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");

      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
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
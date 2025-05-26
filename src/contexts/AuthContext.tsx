// AuthContext.tsx corrigido
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

// Usuários válidos para demonstração
const VALID_USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@portfolio.com",
    password: "admin123",
    role: "admin",
    avatar: "/images/placeholder-avatar.png"
  },
  {
    id: "2", 
    name: "Luiz Felippe",
    email: "luizfelippeandrade@outlook.com",
    password: "123456",
    role: "admin",
    avatar: "/images/placeholder-avatar.png"
  }
];

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
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  // Verificar autenticação ao carregar
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('auth_user');
          const storedToken = localStorage.getItem('auth_token');
          
          if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            
            // Verificar se o token não expirou
            const token = JSON.parse(atob(storedToken));
            if (token.exp > Date.now()) {
              dispatch({ type: "LOGIN_SUCCESS", payload: user });
            } else {
              // Token expirado, limpar dados
              localStorage.removeItem('auth_user');
              localStorage.removeItem('auth_token');
            }
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: "LOGIN_START" });
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciais
      const validUser = VALID_USERS.find(
        user => user.email === email && user.password === password
      );
      
      if (validUser) {
        const user = {
          id: validUser.id,
          name: validUser.name,
          email: validUser.email,
          role: validUser.role,
          avatar: validUser.avatar
        };
        
        const token = btoa(JSON.stringify({
          userId: user.id,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        }));
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } else {
        throw new Error("Email ou senha incorretos");
      }
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      dispatch({ type: "LOGOUT" });
      router.push('/login');
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
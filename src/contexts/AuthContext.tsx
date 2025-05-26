// src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Not needed directly in AuthContext

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
  isLoading: boolean; // Indicates if the initial auth check is in progress
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean } // Explicitly control loading state
  | { type: "CLEAR_ERROR" };

// Usuários válidos para demonstração
const VALID_USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@portfolio.com",
    password: "admin123",
    role: "admin",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "2",
    name: "Luiz Felippe",
    email: "luizfelippeandrade@outlook.com",
    password: "123456",
    role: "admin", // Assuming Luiz Felippe is also an admin for demo purposes
    avatar: "/api/placeholder/40/40"
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
        isLoading: false, // Ensure loading is false after logout
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
}>({
  state: {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Initial state should be loading true
    error: null,
  },
  login: async () => false,
  logout: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Initialize as loading
    error: null,
  });

  // Verify authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      // Ensure this runs only once on initial mount
      if (typeof window === 'undefined') {
        dispatch({ type: "SET_LOADING", payload: false }); // For SSR, we are not authenticated initially
        return;
      }

      // Start loading
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');

        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser);
            // In a real app, you'd send the token to your backend to validate it
            // For this demo, we're just checking the expiry from the mock token data
            const tokenData = JSON.parse(atob(storedToken));
            
            // Check if the token has expired
            if (tokenData.exp && tokenData.exp > Date.now()) {
              dispatch({ type: "LOGIN_SUCCESS", payload: user });
            } else {
              // Token expired, clear data
              console.log("Token expirado ou inválido. Limpando sessão.");
              localStorage.removeItem('auth_user');
              localStorage.removeItem('auth_token');
              dispatch({ type: "LOGOUT" }); // Dispatch logout to ensure state is clear
            }
          } catch (e) {
            console.error("Error processing authentication data:", e);
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
            dispatch({ type: "LOGOUT" });
          }
        } else {
          // No stored user or token
          dispatch({ type: "LOGOUT" }); // Ensure state is not authenticated
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        dispatch({ type: "LOGOUT" });
      } finally {
        // Always set loading to false after the check is complete
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []); // Empty dependency array means it runs only once on mount

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: "LOGIN_START" });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify credentials
      const validUser = VALID_USERS.find(
        user => user.email === email && user.password === password
      );

      if (validUser) {
        const user: User = { // Ensure type is User
          id: validUser.id,
          name: validUser.name,
          email: validUser.email,
          role: validUser.role,
          avatar: validUser.avatar
        };

        // Create a mock token with expiry
        const token = btoa(JSON.stringify({
          userId: user.id,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiry from now
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
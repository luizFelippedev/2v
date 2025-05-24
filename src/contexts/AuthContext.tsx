"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "visitor";
  avatar?: string;
  stats: {
    loginCount: number;
    lastLogin: Date;
    timeSpent: number;
  };
  permissions: {
    canCreateProjects: boolean;
    canEditProjects: boolean;
    canDeleteProjects: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
  };
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
  | { type: "CLEAR_ERROR" }
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
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkPermission: (permission: keyof User["permissions"]) => boolean;
  trackAction: (action: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Error accessing localStorage:", error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Error setting localStorage:", error);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Error removing from localStorage:", error);
    }
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [initialized, setInitialized] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Check for stored auth data
        const token = safeLocalStorage.getItem("portfolio_token");
        const userEmail = safeLocalStorage.getItem("user_email");
        const userRole = safeLocalStorage.getItem("user_role");
        const userName = safeLocalStorage.getItem("user_name");

        if (token && userEmail && userRole) {
          // Create user object from stored data
          const user: User = {
            id: "1",
            name: userName || (userEmail === "admin@portfolio.com" ? "Admin User" : "Luiz Felippe"),
            email: userEmail,
            role: userRole as "admin" | "user" | "visitor",
            avatar: "/api/placeholder/40/40",
            stats: {
              loginCount: 1,
              lastLogin: new Date(),
              timeSpent: 0,
            },
            permissions: {
              canCreateProjects: true,
              canEditProjects: true,
              canDeleteProjects: true,
              canManageUsers: true,
              canViewAnalytics: true,
            },
          };

          dispatch({ type: "LOGIN_SUCCESS", payload: user });
          console.log("Auth restored from localStorage:", user.email);
        } else {
          // No valid auth data found
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo credentials
      const validCredentials = [
        { email: "admin@portfolio.com", password: "admin123", role: "admin", name: "Admin User" },
        { email: "luizfelippeandrade@outlook.com", password: "123456", role: "admin", name: "Luiz Felippe" },
      ];

      const credential = validCredentials.find(
        (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      if (credential) {
        const user: User = {
          id: "1",
          name: credential.name,
          email: credential.email,
          role: credential.role as "admin",
          avatar: "/api/placeholder/40/40",
          stats: {
            loginCount: 1,
            lastLogin: new Date(),
            timeSpent: 0,
          },
          permissions: {
            canCreateProjects: true,
            canEditProjects: true,
            canDeleteProjects: true,
            canManageUsers: true,
            canViewAnalytics: true,
          },
        };

        // Store auth data
        const token = "demo-jwt-token-" + Date.now();
        safeLocalStorage.setItem("portfolio_token", token);
        safeLocalStorage.setItem("user_email", user.email);
        safeLocalStorage.setItem("user_name", user.name);
        safeLocalStorage.setItem("user_role", user.role);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        console.log("Login successful:", user.email);
        return true;
      } else {
        throw new Error("Credenciais inválidas. Use: admin@portfolio.com / admin123 ou luizfelippeandrade@outlook.com / 123456");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao fazer login. Tente novamente.";
      console.error("Login error:", errorMessage);
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear localStorage
      safeLocalStorage.removeItem("portfolio_token");
      safeLocalStorage.removeItem("user_email");
      safeLocalStorage.removeItem("user_role");
      safeLocalStorage.removeItem("user_name");

      // Update state
      dispatch({ type: "LOGOUT" });
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still logout even if there's an error
      dispatch({ type: "LOGOUT" });
    }
  };

  const checkPermission = (permission: keyof User["permissions"]): boolean => {
    return state.user?.permissions[permission] || false;
  };

  const trackAction = (action: string) => {
    console.log("Action tracked:", action);
    // In a real app, send to analytics
  };

  // Don't render children until auth is checked
  if (!initialized) {
    return null; // We'll handle loading state in the page components
  }

  const value: AuthContextType = {
    state,
    dispatch,
    login,
    logout,
    checkPermission,
    trackAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
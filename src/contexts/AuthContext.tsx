// src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "@/services/auth.service";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const token = localStorage.getItem("portfolio_token");
      if (!token) {
        dispatch({ type: "AUTH_FAILED" });
        return;
      }

      const response = await authService.verifyToken();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.data.user },
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILED" });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.login(email, password);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.data.user },
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || "Erro ao fazer login",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function authReducer(state: any, action: any) {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
}
import { User } from "@/types";
import { AUTH_STORAGE_KEYS } from "@/constants";

export const setAuthData = (user: User, token: string) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

export const getStoredAuthData = () => {
  try {
    const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    return {
      user: user ? JSON.parse(user) : null,
      token
    };
  } catch (error) {
    clearAuthData();
    return { user: null, token: null };
  }
};

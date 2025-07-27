"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api, handleApiError } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token management utilities
const TOKEN_STORAGE_KEY = "monty_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "monty_refresh_token";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const setStoredToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const getStoredRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

const setStoredRefreshToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

const clearStoredTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          await refreshUser();
        } catch {
          clearStoredTokens();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/api/v1/auth/login", {
        email,
        password,
      });

      setStoredToken(response.accessToken);
      setStoredRefreshToken(response.refreshToken);
      setUser(response.user);

      toast.success("Login successful!");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await api.post<AuthResponse>("/api/v1/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      setStoredToken(response.accessToken);
      setStoredRefreshToken(response.refreshToken);
      setUser(response.user);

      toast.success("Account created successfully!");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const logout = () => {
    clearStoredTokens();
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) throw new Error("No token available");

    try {
      const userData = await api.get<User>("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(userData);
    } catch (error) {
      clearStoredTokens();
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

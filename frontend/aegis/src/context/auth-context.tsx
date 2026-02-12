"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  name: string;
  email: string;
  role: string;
  institution?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  getInitials: () => string;
  refreshUser: () => void; // Added this helper
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1. Rehydrate User on Load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        const token = localStorage.getItem("access_token");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Note: We don't verify the token with the backend here to save latency.
          // If the token IS invalid, the first API call (e.g. Dashboard) will fail with 401,
          // and the api.ts interceptor will handle the logout automatically.
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Helper to refresh user data from local storage (useful after profile updates)
  const refreshUser = () => {
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
          setUser(JSON.parse(storedUser));
      }
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = { username: email, password: password };
      const response = await api.post("/auth/login/", payload);
      const { access, refresh, ...userData } = response.data;

      // Save Data
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_data", JSON.stringify(userData));
      
      setUser(userData);

      // Redirect based on Role
      if (userData.role === "SUPER_ADMIN") router.push("/superuser");
      else if (userData.role === "INSTITUTION_ADMIN") router.push("/dashboard");
      else if (userData.role === "STUDENT") router.push("/student");
      else router.push("/");

    } catch (err: any) {
      console.error("Login Failed:", err);
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Connection failed. Please check the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, getInitials, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
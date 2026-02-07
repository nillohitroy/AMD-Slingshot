"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

// Define the exact shape of the user object
interface User {
  name: string;
  email: string;
  role: string; // Using string to be flexible, or specific union "STUDENT" | "INSTITUTION_ADMIN" | ...
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // CRITICAL FIX: Initialize as true. The app waits for Auth check before rendering pages.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1. Rehydrate User on Load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        const token = localStorage.getItem("access_token");

        if (token && storedUser) {
          // Optional: Add logic here to check if token is expired via API
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
        // If data is corrupted, clear it
        localStorage.removeItem("user_data");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        // CRITICAL FIX: Only set loading to false AFTER we have checked storage
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Helper to generate initials (e.g. "Alex Miller" -> "AM")
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // FIX: Map email to 'username' for Django
      const payload = {
        username: email,
        password: password
      };

      console.log("Sending Login Request:", payload);

      const response = await api.post("/auth/login/", payload);

      console.log("Login Success:", response.data);

      const { access, refresh, ...userData } = response.data;

      // Save Data
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);

      // Redirect based on Role
      if (userData.role === "SUPER_ADMIN") {
        router.push("/superuser");
      } else if (userData.role === "INSTITUTION_ADMIN") {
        router.push("/dashboard");
      } else if (userData.role === "STUDENT") {
        router.push("/student");
      } else {
        router.push("/");
      }

    } catch (err: any) {
      console.error("Login Failed:", err.response?.data || err.message);

      if (err.response?.status === 400) {
        setError("Invalid credentials or request format.");
      } else if (err.response?.status === 401) {
        setError("Incorrect password or email.");
      } else {
        setError("Server error. Please try again later.");
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
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, getInitials }}>
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
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: "employee" | "admin";
  department: string;
  securityScore: number;
  streakDays: number;
  avatarUrl?: string | null;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (role: "employee" | "admin" | "employee_alex") => void;
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  removeToast: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DEFAULT_EMPLOYEE: User = {
  id: "usr_emp_101",
  employeeId: "EMP-1042",
  email: "emp101@cyberguard.internal",
  name: "Sarah Connor",
  role: "employee",
  department: "Cloud Operations",
  securityScore: 88,
  streakDays: 6,
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
};

const DEMO_USERS: Record<string, User> = {
  employee: DEFAULT_EMPLOYEE,
  employee_alex: {
    id: "usr_emp_102",
    employeeId: "EMP-1088",
    email: "alex.chen@cyberguard.internal",
    name: "Alex Chen",
    role: "employee",
    department: "Finance & Accounts",
    securityScore: 92,
    streakDays: 9,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  admin: {
    id: "usr_admin_01",
    employeeId: "SEC-ADMIN-01",
    email: "admin@cyberguard.internal",
    name: "Marcus Vance (CISO)",
    role: "admin",
    department: "Information Security & SOC",
    securityScore: 99,
    streakDays: 24,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_EMPLOYEE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const saved = localStorage.getItem("cyberguard_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = async (identifier: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Login failed", "error");
        return { success: false, error: data.error };
      }

      setCurrentUser(data.user);
      localStorage.setItem("cyberguard_user", JSON.stringify(data.user));
      showToast(`Welcome back, ${data.user.name}! Authenticated successfully.`, "success");

      if (data.user.role === "admin") {
        setActiveTab("admin");
      } else {
        setActiveTab("dashboard");
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during login";
      showToast(msg, "error");
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cyberguard_user");
    showToast("You have been securely signed out.", "info");
    setActiveTab("landing");
  };

  const switchDemoUser = (role: "employee" | "admin" | "employee_alex") => {
    const selected = DEMO_USERS[role] || DEFAULT_EMPLOYEE;
    setCurrentUser(selected);
    localStorage.setItem("cyberguard_user", JSON.stringify(selected));
    showToast(`Switched account to: ${selected.name} (${selected.role.toUpperCase()})`, "success");
    if (selected.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        setCurrentUser,
        login,
        logout,
        switchDemoUser,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

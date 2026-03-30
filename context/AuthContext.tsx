"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: "user" | "operator" | "admin";
}

interface AuthContextType {
  role: "user" | "operator" | "admin" | null;
  user: UserInfo | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  role: null,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ht_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("ht_user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }
    const data = await res.json();
    setUser(data);
    localStorage.setItem("ht_user", JSON.stringify(data));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Registration failed");
    }
    const data = await res.json();
    setUser(data);
    localStorage.setItem("ht_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ht_user");
  };

  return (
    <AuthContext.Provider
      value={{ role: user?.role ?? null, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

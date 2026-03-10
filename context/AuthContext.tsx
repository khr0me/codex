"use client";
import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  role: "user" | "operator" | "admin" | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  role: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<"user" | "operator" | "admin" | null>(
    null
  );

  const login = async (email: string, password: string) => {
    // call backend to authenticate and get role
    // stubbed for now
    if (email === "admin@example.com") setRole("admin");
    else if (email === "operator@example.com") setRole("operator");
    else setRole("user");
  };

  const logout = () => {
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

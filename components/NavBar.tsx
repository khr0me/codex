"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const NavBar: React.FC = () => {
  const { role, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              HealthTicket
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              {role && (
                <Link
                  href="/tickets"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Tickets
                </Link>
              )}
              {role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {role ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Role: {role}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

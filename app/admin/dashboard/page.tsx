"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminDashboard } from "../../../components/AdminDashboard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem("ht_user");
        if (!stored) {
          setError("Not authenticated");
          return;
        }
        const user = JSON.parse(stored);
        if (user.role !== "admin") {
          setError("Access denied");
          return;
        }
        const res = await fetch(`/api/admin/metrics?role=${user.role}&userId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch metrics");
        const data = await res.json();
        setStats(data);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      }
    }
    load();
  }, []);

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t("admin.loading")}</p>
      </div>
    </div>
  );

  return <AdminDashboard {...stats} />;
}

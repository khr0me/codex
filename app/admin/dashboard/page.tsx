"use client";
import React, { useEffect, useState } from "react";
import { AdminDashboard } from "../../../components/AdminDashboard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      // TODO fetch real metrics from API
      setStats({
        ticketsByCategory: { IT: 12, Administrative: 5, Other: 3 },
        busiestOperators: [
          { name: "Alice", count: 7 },
          { name: "Bob", count: 5 },
          { name: "Charlie", count: 3 },
        ],
        meanResolutionHours: 24.3,
        totalTickets: 45,
        openTickets: 20,
        slaBreaches: 2,
      });
    }
    load();
  }, []);

  if (!stats) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  return <AdminDashboard {...stats} />;
}

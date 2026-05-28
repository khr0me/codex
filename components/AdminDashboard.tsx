"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  DoughnutController,
} from "chart.js";
import { Pie, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  DoughnutController
);

interface ActivityEntry {
  id: string;
  ticketId: string;
  action: string;
  details: string;
  userId: string | null;
  timestamp: string;
  ticketTitle: string | null;
  userName: string | null;
}

interface AdminDashboardProps {
  ticketsByCategory: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  busiestOperators: { name: string; count: number }[];
  meanResolutionHours: number;
  totalTickets: number;
  openTickets: number;
  slaBreaches: number;
  avgRating: number | null;
  totalRatings: number;
  recentActivity: ActivityEntry[];
}

function StatCard({
  label,
  value,
  gradient,
  icon,
  sub,
}: {
  label: string;
  value: string | number;
  gradient: string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-3`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function useTimeAgo() {
  const { t } = useTranslation();
  return (timestamp: string): string => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("admin.justNow");
    if (mins < 60) return t("admin.minutesAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("admin.hoursAgo", { count: hrs });
    const days = Math.floor(hrs / 24);
    return t("admin.daysAgo", { count: days });
  };
}

function useActionColor() {
  const { t } = useTranslation();
  return (action: string): { color: string; label: string } => {
    switch (action) {
      case "Created": return { color: "bg-blue-100 text-blue-700", label: t("admin.actionCreated") };
      case "Closed": return { color: "bg-green-100 text-green-700", label: t("admin.actionClosed") };
      case "Assigned": return { color: "bg-purple-100 text-purple-700", label: t("admin.actionAssigned") };
      case "Updated": return { color: "bg-amber-100 text-amber-700", label: t("admin.actionUpdated") };
      default: return { color: "bg-gray-100 text-gray-600", label: action };
    }
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  ticketsByCategory,
  ticketsByStatus,
  ticketsByPriority,
  busiestOperators,
  meanResolutionHours,
  totalTickets,
  openTickets,
  slaBreaches,
  avgRating,
  totalRatings,
  recentActivity,
}) => {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo();
  const getAction = useActionColor();

  // ── Chart data ────────────────────────────────────────────────
  const categoryData = {
    labels: Object.keys(ticketsByCategory).map((k) => t(`category.${k}`)),
    datasets: [
      {
        data: Object.values(ticketsByCategory),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const statusData = {
    labels: Object.keys(ticketsByStatus).map((k) => t(`status.${k}`)),
    datasets: [
      {
        data: Object.values(ticketsByStatus),
        backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };

  const priorityData = {
    labels: Object.keys(ticketsByPriority).map((k) => t(`priority.${k}`)),
    datasets: [
      {
        label: t("admin.ticketsAssigned"),
        data: Object.values(ticketsByPriority),
        backgroundColor: ["#94a3b8", "#3b82f6", "#f97316", "#ef4444"],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const operatorData = {
    labels: busiestOperators.map((op) => op.name),
    datasets: [
      {
        label: t("admin.ticketsAssigned"),
        data: busiestOperators.map((op) => op.count),
        backgroundColor: "rgba(99,102,241,0.85)",
        borderColor: "#6366f1",
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8, font: { size: 12 } },
      },
      title: { display: false },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: { stepSize: 1 },
      },
    },
  };

  // ── Stat cards config ─────────────────────────────────────────
  const statCards = [
    {
      label: t("admin.totalTickets"),
      value: totalTickets,
      gradient: "from-blue-500 to-blue-600",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: t("admin.openTickets"),
      value: openTickets,
      gradient: "from-emerald-500 to-emerald-600",
      sub: totalTickets > 0 ? `${Math.round((openTickets / totalTickets) * 100)}${t("admin.ofTotal")}` : undefined,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: t("admin.avgResolution"),
      value: meanResolutionHours > 0 ? `${meanResolutionHours.toFixed(1)}h` : "—",
      gradient: "from-amber-500 to-amber-600",
      sub: meanResolutionHours > 0 ? t("admin.basedOnClosed") : t("admin.noClosedTickets"),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: t("admin.slaBreaches"),
      value: slaBreaches,
      gradient: slaBreaches > 0 ? "from-red-500 to-red-600" : "from-gray-400 to-gray-500",
      sub: slaBreaches > 0 ? t("admin.requiresAttention") : t("admin.allWithinSla"),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    {
      label: t("admin.avgRating"),
      value: avgRating != null ? `${avgRating.toFixed(1)} / 5` : "—",
      gradient: "from-violet-500 to-violet-600",
      sub: totalRatings > 0 ? t("admin.ratingsCount_other", { count: totalRatings }) : t("admin.noRatingsYet"),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("admin.title")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("admin.subtitle")}</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            {t("admin.liveData")}
          </span>
        </div>

        {/* Stat cards — 5 columns on xl, 3 on md, 2 on sm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} gradient={s.gradient} icon={s.icon} sub={s.sub} />
          ))}
        </div>

        {/* Charts row 1: category pie + status doughnut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t("admin.categoriesTitle")}</h3>
            <div className="max-w-xs mx-auto">
              <Pie data={categoryData} options={pieOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t("admin.statusTitle")}</h3>
            <div className="max-w-xs mx-auto">
              <Doughnut data={statusData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Charts row 2: priority bar + operators bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t("admin.priorityTitle")}</h3>
            <Bar data={priorityData} options={barOptions} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t("admin.busiestOperators")}</h3>
            {busiestOperators.length > 0 ? (
              <Bar data={operatorData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                {t("admin.noOperators")}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{t("admin.recentActivity")}</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">{t("admin.recentActivityDesc")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentActivity.map((entry) => {
                const { color: actionCls, label: actionLabel } = getAction(entry.action);
                return (
                <li key={entry.id} className="flex items-start gap-3 py-3">
                  <span className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${actionCls}`}>
                    {actionLabel}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">
                      {entry.ticketTitle ? (
                        <>
                          <span className="font-medium">{entry.ticketTitle}</span>
                          {" — "}
                          <span className="text-gray-500">{entry.details}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">{entry.details}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.userName ?? t("admin.system")} · {timeAgo(entry.timestamp)}
                    </p>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

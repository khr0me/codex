"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { fetchTickets } from "../../lib/api";
import { Ticket, TicketStatus } from "../../types/ticket";
import { TicketCard } from "../../components/TicketCard";
import { AuthContext } from "../../context/AuthContext";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "All">("All");
  const [loading, setLoading] = useState(true);
  const { role } = useContext(AuthContext);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (role === null) {
      router.push("/auth/login");
    }
  }, [role, router]);

  const statusFilters: { label: string; value: TicketStatus | "All"; dot?: string }[] = [
    { label: t("tickets.all"), value: "All" },
    { label: t("tickets.open"), value: "Open", dot: "bg-emerald-500" },
    { label: t("tickets.inProgress"), value: "In Progress", dot: "bg-blue-500" },
    { label: t("tickets.onHold"), value: "On Hold", dot: "bg-amber-500" },
    { label: t("tickets.closed"), value: "Closed", dot: "bg-gray-400" },
  ];

  useEffect(() => {
    async function load() {
      const data = await fetchTickets();
      setTickets(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredTickets = filter === "All" ? tickets : tickets.filter(t => t.status === filter);

  const getCount = (status: TicketStatus | "All") =>
    status === "All" ? tickets.length : tickets.filter(t => t.status === status).length;

  if (role === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">{t("tickets.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("tickets.title")}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {tickets.length} {tickets.length !== 1 ? t("tickets.totalPlural") : t("tickets.total")}
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 text-base animate-pulse hover:animate-none ring-2 ring-blue-300 ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{t("tickets.createNew")}</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((s) => (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === s.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                {s.dot && (
                  <span className={`w-2 h-2 rounded-full mr-2 ${filter === s.value ? "bg-white" : s.dot}`} />
                )}
                {s.label}
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-md font-semibold ${
                  filter === s.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {getCount(s.value)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">{t("tickets.loading")}</p>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">{t("tickets.noTickets")}</p>
            <p className="text-sm text-gray-400 mt-1">{t("tickets.noTicketsHint")}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

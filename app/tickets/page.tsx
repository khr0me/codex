"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTickets } from "../../lib/api";
import { Ticket, TicketStatus } from "../../types/ticket";
import { TicketCard } from "../../components/TicketCard";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "All">("All");

  useEffect(() => {
    async function load() {
      const data = await fetchTickets();
      setTickets(data);
    }
    load();
  }, []);

  const filteredTickets = filter === "All" ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <Link
            href="/tickets/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Create New Ticket
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {["All", "Open", "In Progress", "On Hold", "Closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as TicketStatus | "All")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

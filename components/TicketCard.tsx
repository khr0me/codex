import Link from "next/link";
import React from "react";
import { Ticket } from "../types/ticket";

interface TicketCardProps {
  ticket: Ticket;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Open": return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20";
    case "In Progress": return "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20";
    case "On Hold": return "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20";
    case "Closed": return "bg-gray-100 text-gray-600 ring-1 ring-gray-500/20";
    default: return "bg-gray-100 text-gray-600 ring-1 ring-gray-500/20";
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "Critical": return { color: "text-red-700 bg-red-50 ring-1 ring-red-600/20", dot: "bg-red-500" };
    case "High": return { color: "text-orange-700 bg-orange-50 ring-1 ring-orange-600/20", dot: "bg-orange-500" };
    case "Medium": return { color: "text-yellow-700 bg-yellow-50 ring-1 ring-yellow-600/20", dot: "bg-yellow-500" };
    case "Low": return { color: "text-green-700 bg-green-50 ring-1 ring-green-600/20", dot: "bg-green-500" };
    default: return { color: "text-gray-600 bg-gray-50", dot: "bg-gray-400" };
  }
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const priorityStyle = getPriorityStyle(ticket.priority);

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Header: title + status */}
      <div className="flex items-start gap-3 mb-3">
        <h3 className="flex-1 font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {ticket.title}
        </h3>
        <span className={`inline-flex items-center whitespace-nowrap flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusStyle(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{ticket.description}</p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-medium">
          <svg className="w-3 h-3 mr-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {ticket.category}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-md font-medium ${priorityStyle.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priorityStyle.dot}`} />
          {ticket.priority}
        </span>
        {ticket.attachments && ticket.attachments.length > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-500 font-medium">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {ticket.attachments.length}
          </span>
        )}
        <span className="ml-auto text-gray-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
};

import Link from "next/link";
import React from "react";
import { Ticket } from "../types/ticket";

interface TicketCardProps {
  ticket: Ticket;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open": return "bg-green-100 text-green-800";
    case "In Progress": return "bg-blue-100 text-blue-800";
    case "On Hold": return "bg-yellow-100 text-yellow-800";
    case "Closed": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical": return "text-red-600";
    case "High": return "text-orange-600";
    case "Medium": return "text-yellow-600";
    case "Low": return "text-green-600";
    default: return "text-gray-600";
  }
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{ticket.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{ticket.description}</p>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">{ticket.category}</span>
          <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
        </div>
        <span className="text-gray-500">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>

      {ticket.attachments && ticket.attachments.length > 0 && (
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          {ticket.attachments.length} attachment{ticket.attachments.length !== 1 ? 's' : ''}
        </div>
      )}
    </Link>
  );
};

"use client";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { fetchTicket, updateTicket } from "../../../lib/api";
import { Ticket, Comment, TicketHistory } from "../../../types/ticket";
import { CommentThread } from "../../../components/CommentThread";
import { RatingForm } from "../../../components/RatingForm";
import { AuthContext } from "../../../context/AuthContext";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Open": return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20";
    case "In Progress": return "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20";
    case "On Hold": return "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20";
    case "Closed": return "bg-gray-100 text-gray-600 ring-1 ring-gray-500/20";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "Critical": return { text: "text-red-700", bg: "bg-red-50 ring-1 ring-red-600/20", dot: "bg-red-500" };
    case "High": return { text: "text-orange-700", bg: "bg-orange-50 ring-1 ring-orange-600/20", dot: "bg-orange-500" };
    case "Medium": return { text: "text-yellow-700", bg: "bg-yellow-50 ring-1 ring-yellow-600/20", dot: "bg-yellow-500" };
    case "Low": return { text: "text-green-700", bg: "bg-green-50 ring-1 ring-green-600/20", dot: "bg-green-500" };
    default: return { text: "text-gray-600", bg: "bg-gray-50", dot: "bg-gray-400" };
  }
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<TicketHistory[]>([]);
  const { role, user } = useContext(AuthContext);
  const [newStatus, setNewStatus] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const { t } = useTranslation();

  const loadTicket = useCallback(async () => {
    if (!id) return;
    const data = await fetchTicket(id as string);
    setTicket(data.ticket);
    setComments(data.comments);
    setHistory(data.history || []);
    setNewStatus(data.ticket.status);
    setAssignee(data.ticket.assigneeId || "");
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleUpdate = async () => {
    if (!ticket) return;
    try {
      await updateTicket(ticket.id, { status: newStatus, assigneeId: assignee });
      setTicket({ ...ticket, status: newStatus as any, assigneeId: assignee });
    } catch (err) {
      console.error(err);
      alert(t("ticketDetail.failedUpdate"));
    }
  };

  const isOverdue = ticket && ticket.slaHours && (new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60) > ticket.slaHours;

  if (!ticket) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500">{t("ticketDetail.loadingTicket")}</p>
      </div>
    </div>
  );

  const pStyle = getPriorityStyle(ticket.priority);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/tickets" className="hover:text-blue-600 transition-colors">{t("ticketDetail.breadcrumb")}</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">#{ticket.id}</span>
        </nav>

        <Link
          href="/tickets"
          className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{t("ticketDetail.backToTickets", "Back to all tickets")}</span>
        </Link>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{ticket.title}</h1>
                <p className="text-sm text-gray-500 mt-1.5">
                  {t("ticketDetail.created")} {new Date(ticket.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <span className={`inline-flex items-center whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-semibold ${getStatusStyle(ticket.status)}`}>
                  {t(`status.${ticket.status}`)}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-100 text-red-700 ring-1 ring-red-600/20">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("ticketDetail.slaBreach")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Details card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t("ticketDetail.details")}</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
                      {t("ticketDetail.categoryLabel")}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">{t(`category.${ticket.category}`)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {t("ticketDetail.priorityLabel")}
                    </dt>
                    <dd className={`inline-flex items-center text-sm font-semibold px-2.5 py-1 rounded-lg ${pStyle.bg} ${pStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${pStyle.dot}`} />
                      {t(`priority.${ticket.priority}`)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t("ticketDetail.lastUpdated")}
                    </dt>
                    <dd className="text-sm font-medium text-gray-700">{new Date(ticket.updatedAt).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

              {/* Description card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t("ticketDetail.descriptionLabel")}</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>

            {/* Operator update panel */}
            {(role === "operator" || role === "admin") && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-8 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  {t("ticketDetail.updateTicket")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("ticketDetail.status")}</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="block w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    >
                      <option value="Open">{t("status.Open")}</option>
                      <option value="In Progress">{t("status.In Progress")}</option>
                      <option value="On Hold">{t("status.On Hold")}</option>
                      <option value="Closed">{t("status.Closed")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("ticketDetail.assignee")}</label>
                    <input
                      type="text"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="block w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                      placeholder={t("ticketDetail.assigneePlaceholder")}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleUpdate}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-500/25 text-sm"
                    >
                      {t("ticketDetail.update")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  {t("ticketDetail.attachmentsTitle")} ({ticket.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ticket.attachments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-200 group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">{t("ticketDetail.attachment")} {i + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation section */}
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {t("ticketDetail.conversation")}
              </h2>
              <CommentThread
                comments={comments}
                onPost={async (text, internal) => {
                  await fetch(`/api/tickets/${ticket.id}/comments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      authorId: user?.id || "anonymous",
                      content: text,
                      internal,
                    }),
                  });
                  await loadTicket();
                }}
                isOperator={role === "operator" || role === "admin"}
                canComment={!!user && (user.id === ticket.requesterId || role === "operator" || role === "admin")}
              />
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="border-t border-gray-100 pt-8 mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t("ticketDetail.history")}
                </h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-4">
                    {history.map((entry) => (
                      <div key={entry.id} className="relative flex items-start pl-10">
                        <div className="absolute left-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-white">
                          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 flex-1 border border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{entry.action}: {entry.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(entry.timestamp).toLocaleString()} by <span className="font-medium">{entry.userId}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rating section */}
            {ticket.status === "Closed" && role === "user" && (
              <div className="border-t border-gray-100 pt-8 mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {t("ticketDetail.rateOperator")}
                </h2>
                <RatingForm
                  onSubmit={async (score, comment) => {
                    await fetch(`/api/tickets/${ticket.id}/rating`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId: user?.id || "anonymous",
                        score,
                        comment,
                      }),
                    });
                    loadTicket();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

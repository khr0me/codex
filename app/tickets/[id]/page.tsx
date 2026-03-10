"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchTicket, updateTicket } from "../../../lib/api";
import { Ticket, Comment, TicketHistory } from "../../../types/ticket";
import { CommentThread } from "../../../components/CommentThread";
import { RatingForm } from "../../../components/RatingForm";
import { AuthContext } from "../../../context/AuthContext";

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<TicketHistory[]>([]);
  const { role } = useContext(AuthContext);
  const [newStatus, setNewStatus] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");

  useEffect(() => {
    if (id) {
      async function load() {
        const data = await fetchTicket(id);
        setTicket(data.ticket);
        setComments(data.comments);
        setHistory(data.history || []);
        setNewStatus(data.ticket.status);
        setAssignee(data.ticket.assigneeId || "");
      }
      load();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!ticket) return;
    try {
      await updateTicket(ticket.id, { status: newStatus, assigneeId: assignee });
      setTicket({ ...ticket, status: newStatus as any, assigneeId: assignee });
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket");
    }
  };

  const isOverdue = ticket && ticket.slaHours && (new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60) > ticket.slaHours;

  if (!ticket) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading ticket...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <p className="text-sm text-gray-600 mt-1">Ticket #{ticket.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ticket.status === "Open" ? "bg-green-100 text-green-800" :
                  ticket.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                  ticket.status === "On Hold" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {ticket.status}
                </span>
                {isOverdue && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    SLA Breached
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Details</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-600">Category</dt>
                    <dd className="text-sm font-medium text-gray-900">{ticket.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Priority</dt>
                    <dd className={`text-sm font-medium ${
                      ticket.priority === "Critical" ? "text-red-600" :
                      ticket.priority === "High" ? "text-orange-600" :
                      ticket.priority === "Medium" ? "text-yellow-600" :
                      "text-green-600"
                    }`}>
                      {ticket.priority}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Created</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Last Updated</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</h3>
                <p className="mt-2 text-sm text-gray-900">{ticket.description}</p>
              </div>
            </div>

            {(role === "operator" || role === "admin") && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Ticket</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assignee ID</label>
                    <input
                      type="text"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Assignee ID"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleUpdate}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {ticket.attachments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm text-blue-600">Attachment {i + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Conversation</h2>
              <CommentThread
                comments={comments}
                onPost={(text, internal) => {
                  // TODO: implement posting comments
                  console.log("post", text, internal);
                }}
                isOperator={role === "operator" || role === "admin"}
              />
            </div>

            {history.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">History</h2>
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{entry.action}: {entry.details}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()} by {entry.userId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ticket.status === "Closed" && role === "user" && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Rate the Operator</h2>
                <RatingForm
                  onSubmit={(score, comment) => {
                    // TODO: implement rating submission
                    console.log("rating", score, comment);
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
}

export type TicketCategory = "IT" | "Administrative" | "Other";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type TicketStatus =
  | "Open"
  | "In Progress"
  | "On Hold"
  | "Closed";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  requesterId: string;
  assigneeId?: string;
  attachments?: string[]; // urls
  slaHours?: number; // SLA in hours
  rating?: number; // 1-5 stars
  ratingComment?: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  createdAt: string;
  internal?: boolean; // operator-only comments
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  action: string; // e.g., "Created", "Assigned", "Status Changed"
  details: string;
  userId: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  role: "user" | "operator" | "admin";
  name: string;
}

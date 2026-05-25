import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { tickets, users, ticketHistory, ratings } from "../../../../lib/schema";
import { eq, and, lt, isNotNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role");

  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch all tickets with assignee name
  const allTickets = await db
    .select({
      id: tickets.id,
      category: tickets.category,
      priority: tickets.priority,
      status: tickets.status,
      assigneeId: tickets.assigneeId,
      slaHours: tickets.slaHours,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
    })
    .from(tickets);

  // Fetch recent ticket history for activity feed (last 10 entries)
  const recentHistory = await db
    .select({
      id: ticketHistory.id,
      ticketId: ticketHistory.ticketId,
      action: ticketHistory.action,
      details: ticketHistory.details,
      userId: ticketHistory.userId,
      timestamp: ticketHistory.timestamp,
      ticketTitle: tickets.title,
      userName: users.name,
    })
    .from(ticketHistory)
    .leftJoin(tickets, eq(ticketHistory.ticketId, tickets.id))
    .leftJoin(users, eq(ticketHistory.userId, users.id))
    .orderBy(ticketHistory.timestamp)
    .all()
    .then((rows) => rows.reverse().slice(0, 10));

  // Fetch all operators with their assigned ticket counts
  const operators = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.role, "operator"));

  // Fetch average rating
  const allRatings = await db.select({ score: ratings.score }).from(ratings);

  // --- Compute metrics ---

  const totalTickets = allTickets.length;
  const openTickets = allTickets.filter(
    (t) => t.status === "Open" || t.status === "In Progress" || t.status === "On Hold"
  ).length;

  // Tickets by category
  const ticketsByCategory: Record<string, number> = { IT: 0, Administrative: 0, Other: 0 };
  for (const t of allTickets) {
    if (t.category in ticketsByCategory) ticketsByCategory[t.category]++;
  }

  // Tickets by status
  const ticketsByStatus: Record<string, number> = {
    Open: 0,
    "In Progress": 0,
    "On Hold": 0,
    Closed: 0,
  };
  for (const t of allTickets) {
    if (t.status in ticketsByStatus) ticketsByStatus[t.status]++;
  }

  // Tickets by priority
  const ticketsByPriority: Record<string, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  };
  for (const t of allTickets) {
    if (t.priority in ticketsByPriority) ticketsByPriority[t.priority]++;
  }

  // Busiest operators (by assigned tickets)
  const operatorCounts: Record<string, { name: string; count: number }> = {};
  for (const op of operators) {
    operatorCounts[op.id] = { name: op.name, count: 0 };
  }
  for (const t of allTickets) {
    if (t.assigneeId && operatorCounts[t.assigneeId]) {
      operatorCounts[t.assigneeId].count++;
    }
  }
  const busiestOperators = Object.values(operatorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Mean resolution time (for Closed tickets)
  const closedTickets = allTickets.filter((t) => t.status === "Closed");
  let meanResolutionHours = 0;
  if (closedTickets.length > 0) {
    const totalHours = closedTickets.reduce((sum, t) => {
      const created = new Date(t.createdAt).getTime();
      const updated = new Date(t.updatedAt).getTime();
      return sum + (updated - created) / (1000 * 60 * 60);
    }, 0);
    meanResolutionHours = totalHours / closedTickets.length;
  }

  // SLA breaches: open tickets where time elapsed > slaHours
  const now = Date.now();
  const slaBreaches = allTickets.filter((t) => {
    if (t.status === "Closed") return false;
    if (!t.slaHours) return false;
    const created = new Date(t.createdAt).getTime();
    const elapsedHours = (now - created) / (1000 * 60 * 60);
    return elapsedHours > t.slaHours;
  }).length;

  // Average satisfaction rating
  const avgRating =
    allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length
      : null;

  return NextResponse.json({
    totalTickets,
    openTickets,
    ticketsByCategory,
    ticketsByStatus,
    ticketsByPriority,
    busiestOperators,
    meanResolutionHours,
    slaBreaches,
    avgRating,
    totalRatings: allRatings.length,
    recentActivity: recentHistory,
  });
}
